import json
import urllib.parse
import boto3
import os
import requests

sample_message = {'Records': [{'messageId': '87320f56-2b43-4b49-bf5f-e0ebd99c9972', 'receiptHandle': 'AQEBYhneNohkmyGLqgiPkkvUklM6GIfL48UwlhwVqyUr6XjBWbAVA2rMzLJr2+ndyVB7yxBj/qRiLXA/MP+ynAiLOPKUOrIoPSJwzohx591elMpJbh/bQmK9vgmPXxJoeoks9HLIErEjJmv+7qNhvvArV+33dqggLN1zA44AJtLLAvUo5gfm/IXHrnq62OQpxRa08Kligbs8e48a7gpT7KugjqROQb6alKC7hYT1FsGzgJZPcOiJ2X24fmfTkskw1q6TZKO6H2s8bZvDm4H5Fvd1h0sqv50+uI2+KNrpHOv0jl7hqFJ4moQqEiPIf/lzIp6WkvnXkJ9NMboTJw5Al/Py156Vddlx1JXyjVamzmS/g0GaiH6gjUupgw0HN4hCti3U0VbBgCLcjkcxSccBygWgP7lyYBCsQgKw8ZAtv+YUUZA=',
                               'body': '{\n  "Type" : "Notification",\n  "MessageId" : "79c8bc6a-ba75-5ff5-93aa-e0145d53b78d",\n  "TopicArn" : "arn:aws:sns:us-east-1:744137563977:dev-textract-sns-topic",\n  "Message" : "{\\"JobId\\":\\"6fa9af92fd758bc94a5a817c49516efd2a4f01f92aeb7bda62d2cac49c879574\\",\\"Status\\":\\"SUCCEEDED\\",\\"API\\":\\"StartDocumentTextDetection\\",\\"Timestamp\\":1678042342035,\\"DocumentLocation\\":{\\"S3ObjectName\\":\\"private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/inputs/2023-03-05T18:51:41.629Z.pdf\\",\\"S3Bucket\\":\\"speakaholic-storage-dev202305-dev\\"}}",\n  "Timestamp" : "2023-03-05T18:52:22.096Z",\n  "SignatureVersion" : "1",\n  "Signature" : "AFxS+KthiBj9MWxeNGzxlmcVpo7v7/1PDfMdlm+cDQA0kehKQ/czoK0k/6N6VmGJXlBwBYrNKc6s8vQTeV7eB6j0l5A8i2gNyQhDPQbHpQz6fh+m/FAGRhB7/jJgqMiPqqg22Lk4BpHLzKzvxYBCdi7aVkZ7ClsOQTkHbmq68/B879mgPXHDs/fWJOsblay6zXwlZ68bfUaLPn2f3ewxebWbRbS5nYKQNP9pRdjBOJLC/uyWiNk66WNyf8P+2optx1LskZ7TvEh/azN05OZ7LGmJ9/dy+KnX9LgpJCnRvOfXIgySBuk/EmKQcEF4kIJa0aySpTClRhvpmyv5s/zHYw==",\n  "SigningCertURL" : "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-56e67fcb41f6fec09b0196692625d385.pem",\n  "UnsubscribeURL" : "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:744137563977:dev-textract-sns-topic:24a223b1-7445-4825-acc2-238d0d816056"\n}', 'attributes': {'ApproximateReceiveCount': '6', 'SentTimestamp': '1678042342141', 'SenderId': 'AIDAIT2UOQQY3AUEKVGXU', 'ApproximateFirstReceiveTimestamp': '1678042342141'}, 'messageAttributes': {}, 'md5OfBody': '873d2daadd26b7d650fcba97d8282d7c', 'eventSource': 'aws:sqs', 'eventSourceARN': 'arn:aws:sqs:us-east-1:744137563977:dev-textract-updates-queue', 'awsRegion': 'us-east-1'}]}


def lambda_handler(event, context):
    print('Loading function')
    print(event)

    env = os.getenv('ENVIRONMENT')
    speech_items_table_name = os.getenv('SPEECHITEMS_TABLE_NAME')
    user_credits_table_name = os.getenv('USERCREDITS_TABLE_NAME')
    speech_key = os.getenv('SPEECH_KEY')

    msg_body = ''
    speech_items_table = None

    if (env == 'local'):
        print("Environment is local, skipping")

        msg_body = sample_message['Records'][0]['body']
        speech_items_table_name = 'SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev'
        user_credits_table_name = 'UserCreditsLeft-iwlprpgqjrhr3d34x4jcfvrp74-dev'
    else:
        print('Environment is not local, processing')
        print("Received event: " + json.dumps(event, indent=2))

        msg_body = event['Records'][0]['body']

    try:
        msg_body = json.loads(msg_body)
        message_json = json.loads(msg_body['Message'])

        job_id = message_json['JobId']
        bucket = message_json['DocumentLocation']['S3Bucket']
        key = message_json['DocumentLocation']['S3ObjectName']

        key_split = key.split('/')
        dynamo_lookup_key = 'inputs/' + key_split[3]
        file_name = key_split[3]
        file_output_path = '%s/%s/%s' % (key_split[0],
                                         key_split[1], file_name.replace('.pdf', '.mp3'))

        # Use boto3 to call Textract to get the job status
        textract = boto3.client('textract')
        response = textract.get_document_text_detection(JobId=job_id)

        if ('SUCCEEDED' not in response['JobStatus']):
            raise Exception('Job Failed')

        index_name = 's3_input_key-index'

        # Use boto3 to lookup the user credits left from dynamodb
        dynamodb = boto3.resource('dynamodb')
        speech_items_table = dynamodb.Table(speech_items_table_name)
        dynamo_response = speech_items_table.query(
            IndexName=index_name,
            KeyConditionExpression='s3_input_key = :s3_input_key',
            ExpressionAttributeValues={
                ':s3_input_key': dynamo_lookup_key
            }
        )

        cognito_user_name = dynamo_response['Items'][0]['cognito_user_name']

        user_credits_left = dynamodb.Table(user_credits_table_name)
        user_credits_left_response = user_credits_left.get_item(
            Key={'id': cognito_user_name})

        credits_left = int(user_credits_left_response['Item']['credits_left'])

        # Loop through the textract blocks to get all the text
        text = ''
        blocks = response['Blocks']
        for block in blocks:
            if block['BlockType'] == 'LINE':
                text += block['Text'] + '\n'
                print(block['Text'])

        while 'NextToken' in response:
            next_token = response['NextToken']
            response = textract.get_document_text_detection(
                JobId=job_id, NextToken=next_token)
            blocks = response['Blocks']
            for block in blocks:
                if block['BlockType'] == 'LINE':
                    text += block['Text'] + '\n'
                    print(block['Text'])

            # Encode SSML reserved characters
        text = text.replace(
            '"', '&quote;').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace("'", '&apos;')

        # Check that the credits left is greater than text length
        if credits_left < len(text) or 63000 < len(text):
            speech_items_table.update_item(
                Key={
                    'id': dynamo_response['Items'][0]['id']
                },
                UpdateExpression='SET is_processed = :is_processed, character_count = :character_count, failed_reason = :failed_reason',
                ExpressionAttributeValues={
                    ':is_processed': True,
                    ':character_count': len(text),
                    ':failed_reason': 'Not enough credits left or too many characters.',
                }
            )

        stream_data = None
        voice = dynamo_response['Items'][0]['voice']
        if 'en-US-' not in voice:
            print('Processing AWS Polly')

            # boto3 pass s3 file to amazon polly for text to speech
            polly = boto3.client('polly')

            # Process text using Polly start synthesize_speech task
            polly_response = polly.start_speech_synthesis_task(
                Engine='neural',
                LanguageCode='en-US',
                OutputFormat='mp3',
                OutputS3BucketName=bucket,
                OutputS3KeyPrefix='%s/%s/' % (key_split[0],
                                              key_split[1]),
                TextType='ssml',
                Text='<speak>%s</speak>' % (text),
                VoiceId=voice,
            )

            output_key_split = polly_response['SynthesisTask']['OutputUri'].split(
                '/')
            output_key = '%s/%s/%s' % (output_key_split[4],
                                       output_key_split[5], output_key_split[6])
            # update dynamo db with new file size
            speech_items_table.update_item(
                Key={
                    'id': dynamo_response['Items'][0]['id']
                },
                UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key, character_count = :character_count, failed_reason = :failed_reason',
                ExpressionAttributeValues={
                    ':is_processed': False,
                    ':s3_output_key': output_key,
                    ':character_count': len(text),
                    ':failed_reason': None
                }
            )

            print(polly_response)
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

            voice = voice
            gender = 'Amber' in voice or 'Ana' in voice or 'Ashley' in voice or 'Elizabeth' in voice or 'Jenny' in voice or 'Michelle' in voice or 'Monica' in voice or 'Nancy' in voice

            if (gender):
                gender = 'Female'
            else:
                gender = 'Male'

            ssml = '''<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='%s' name='%s'>%s</voice></speak>''' % (
                gender, voice, text)

            # make rest call
            response = requests.post(
                url, headers=headers, data=ssml.encode('utf-8'))

            # get the audio stream
            if (response.status_code != 200):
                raise Exception(
                    'Something went wrong with the request %s' % response.reason)

            stream_data = response.content

            s3 = boto3.client('s3')
            # save Azure response to s3
            s3.put_object(
                Body=stream_data,
                Bucket=bucket,
                Key=file_output_path
            )

            # update dynamo db with new file size
            speech_items_table.update_item(
                Key={
                    'id': dynamo_response['Items'][0]['id']
                },
                UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key, character_count = :character_count, failed_reason = :failed_reason',
                ExpressionAttributeValues={
                    ':is_processed': True,
                    ':s3_output_key': file_output_path,
                    ':character_count': len(text),
                    ':failed_reason': None
                }
            )

    except Exception as e:
        try:
            # if table is not None
            if (speech_items_table is not None):
                # update dynamo db with new file size
                speech_items_table.update_item(
                    Key={
                        'id': dynamo_response['Items'][0]['id']
                    },
                    UpdateExpression='SET is_processed = :is_processed, failed_reason = :failed_reason',
                    ExpressionAttributeValues={
                        ':is_processed': True,
                        ':failed_reason': 'An error occurred while processing the file',
                    }
                )
        except Exception as ie:
            print(ie)
        raise e


if __name__ == "__main__":
    lambda_handler(None, None)
