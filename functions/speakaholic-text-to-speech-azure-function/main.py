import os
import azure.cognitiveservices.speech as speechsdk
import json
import urllib
import boto3


def lambda_handler(event, context):
    print('Loading function')

    env = os.getenv('ENVIRONMENT')
    speech_key = os.getenv('SPEECH_KEY')
    speech_region = os.getenv('SPEECH_REGION')
    voice_prefix = 'en-US-'
    voice_suffix = 'Neural'

    speech_config = speechsdk.SpeechConfig(
        subscription=speech_key, region=speech_region)

    speech_config.set_speech_synthesis_output_format(
        speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)

    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

    if (env == 'local'):
        print("Environment is local, skipping")

        bucket = 'speakaholic-storage-dev202305-dev'
        key = 'private/us-east-1:bfb3afa9-5180-4f50-9dd5-d367658b54db/inputs/2023-02-18T14:59:56.273Z.txt'
        speech_items_table_name = 'SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev'
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

    if '.txt' not in key:
        print('Key does not contain .txt skipping')
        return

    key_split = key.split('/')
    dynamo_lookup_key = 'inputs/' + key_split[3]
    file_name = key_split[3]
    file_output_path = '%s/%s/%s' % (key_split[0],
                                     key_split[1], file_name.replace('.txt', '.mp3'))

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

        # if the dynamo speaker name does not contain en-US- then return
        if 'en-US-' not in dynamo_response['Items'][0]['voice']:
            print('Voice does not contain azure, skipping')
            return

        s3 = boto3.client('s3')

        s3_response = s3.get_object(Bucket=bucket, Key=key)

        # read text from s3 object
        text = s3_response['Body'].read().decode('utf-8')

        voice = dynamo_response['Items'][0]['voice']

        speech_config.speech_synthesis_voice_name = voice

        speech_synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=speech_config, audio_config=audio_config)

        speech_synthesis_result = speech_synthesizer.speak_text_async(
            text).get()

        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesized for text")
            # save speech_synthesis_result response to s3
            s3.put_object(
                Body=speech_synthesis_result.audio_data,
                Bucket=bucket,
                Key=file_output_path
            )

            # update dynamo db with new file size
            table.update_item(
                Key={
                    'id': dynamo_response['Items'][0]['id']
                },
                UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key',
                ExpressionAttributeValues={
                    ':is_processed': True,
                    ':s3_output_key': file_output_path
                }
            )
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print("Speech synthesis canceled: {}".format(
                cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                if cancellation_details.error_details:
                    print("Error details: {}".format(
                        cancellation_details.error_details))
                    print("Did you set the speech resource key and region values?")

            raise Exception('Something went wrong while processing the file')
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
