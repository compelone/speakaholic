import json
import urllib.parse
import boto3
import os
import requests
import base64


def lambda_handler(event, context):
    print('Loading function')

    s3 = boto3.client('s3')
    env = os.getenv('ENVIRONMENT')
    speech_items_table_name = os.getenv('SPEECHITEMS_TABLE_NAME')
    speech_key = os.getenv('SPEECH_KEY')
    speech_region = os.getenv('SPEECH_REGION')

    if (env == 'local'):
        print("Environment is local, skipping")

        bucket = 'speakaholic-storage111412-production'
        key = 'private/us-east-1:4a2f991e-1967-44b8-a918-ebe11f8fdcf7/inputs/2023-02-23T08:04:27.330Z.jpg'
        speech_items_table_name = 'SpeechItems-5k4nw2ylcvgsrho4e5brufqfya-production'
    else:
        print('Environment is not local, processing')
        print("Received event: " + json.dumps(event, indent=2))

        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(
            event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    # if the key does not contains /inputs/ return
    if '/inputs/' not in key:
        print('Key does not contain /inputs/ skipping')
        return

    key_split = key.split('/')
    dynamo_lookup_key = 'inputs/' + key_split[3]
    file_name = key_split[3]
    file_output_path = '%s/%s/%s' % (key_split[0],
                                     key_split[1], file_name.replace('.jpg', '.mp3'))

    print('Looking up key %s in bucket %s' % (dynamo_lookup_key, bucket))
    table = None

    try:
        index_name = 's3_input_key-index'

        # boto3 lookup record in dynamo db
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(speech_items_table_name)
        dynamo_response = table.query(
            IndexName=index_name,
            KeyConditionExpression='s3_input_key = :s3_input_key',
            ExpressionAttributeValues={
                ':s3_input_key': dynamo_lookup_key
            }
        )

        # boto3 use aws rekognition to detect text in base64 encoded image
        rekognition = boto3.client('rekognition')
        rekognition_response = rekognition.detect_text(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key,
                },
            }
        )

        # get text from rekognition response
        detected_text = ''
        for text_detection in rekognition_response['TextDetections']:
            if 'ParentId' not in text_detection:
                detected_text += text_detection['DetectedText'] + ' '
                print(text_detection['DetectedText'])
                print(text_detection['Type'])

        # Encode SSML reserved characters
        detected_text = detected_text.replace(
            '"', '&quote;').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace("'", '&apos;')

        stream_data = None
        if 'en-US-' not in dynamo_response['Items'][0]['voice']:
            print('Processing AWS Polly')

            # boto3 pass s3 file to amazon polly for text to speech
            polly = boto3.client('polly')
            polly_response = polly.synthesize_speech(
                OutputFormat='mp3',
                TextType='ssml',
                Text='<speak>%s</speak>' % (detected_text),
                VoiceId=dynamo_response['Items'][0]['voice'],
                Engine='neural'
            )

            stream_data = polly_response['AudioStream'].read()
        else:
            print('Processing Azure text to speech')

            url = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1'

            # set headers for url request
            headers = {
                'Content-Type': 'application/ssml+xml',
                'Host': 'eastus.tts.speech.microsoft.com',
                'User-Agent': 'Speakaholic',
                'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                'Ocp-Apim-Subscription-Key':  speech_key
            }

            voice = dynamo_response['Items'][0]['voice']
            gender = 'Amber' in voice or 'Ana' in voice or 'Ashley' in voice or 'Elizabeth' in voice or 'Jenny' in voice or 'Michelle' in voice or 'Monica' in voice or 'Nancy' in voice

            if (gender):
                gender = 'Female'
            else:
                gender = 'Male'

            ssml = '''<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='%s' name='%s'>%s</voice></speak>''' % (
                gender, voice, detected_text)

            # make rest call
            response = requests.post(
                url, headers=headers, data=ssml.encode('utf-8'))

            # get the audio stream
            if (response.status_code != 200):
                raise Exception(
                    'Something went wrong with the request %s' % response.reason)

            stream_data = response.content

            # speech_config = speechsdk.SpeechConfig(
            #     subscription=speech_key, region=speech_region)

            # speech_config.set_speech_synthesis_output_format(
            #     speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)

            # audio_config = speechsdk.audio.AudioOutputConfig(
            #     use_default_speaker=True)

            # voice = dynamo_response['Items'][0]['voice']

            # speech_config.speech_synthesis_voice_name = voice

            # speech_synthesizer = speechsdk.SpeechSynthesizer(
            #     speech_config=speech_config, audio_config=audio_config)

            # speech_synthesis_result = speech_synthesizer.speak_text_async(
            #     text).get()

            # if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            #     print("Speech synthesized for text")
            #     stream_data = speech_synthesis_result.audio_data
            # elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            #     cancellation_details = speech_synthesis_result.cancellation_details
            #     print("Speech synthesis canceled: {}".format(
            #         cancellation_details.reason))
            #     if cancellation_details.reason == speechsdk.CancellationReason.Error:
            #         if cancellation_details.error_details:
            #             print("Error details: {}".format(
            #                 cancellation_details.error_details))
            #             print(
            #                 "Did you set the speech resource key and region values?")

            #     raise Exception(
            #         'Something went wrong while processing the file')

        # save polly response to s3
        s3.put_object(
            Body=stream_data,
            Bucket=bucket,
            Key=file_output_path
        )

        # update dynamo db with new file size
        table.update_item(
            Key={
                'id': dynamo_response['Items'][0]['id']
            },
            UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key, character_count = :character_count, failed_reason = :failed_reason',
            ExpressionAttributeValues={
                ':is_processed': True,
                ':s3_output_key': file_output_path,
                ':character_count': len(detected_text),
                ':failed_reason': None
            }
        )
    except Exception as e:
        print(e)
        try:
            # if table is not None
            if (table is not None):
                # update dynamo db with new file size
                table.update_item(
                    Key={
                        'id': dynamo_response['Items'][0]['id']
                    },
                    UpdateExpression='SET is_processed = :is_processed, failed_reason = :failed_reason',
                    ExpressionAttributeValues={
                        ':is_processed': False,
                        ':failed_reason': 'An error occurred while processing the file',
                    }
                )
        except Exception as ie:
            print(ie)
        raise e


if __name__ == "__main__":
    lambda_handler(None, None)
