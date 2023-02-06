import json
import urllib.parse
import boto3
import os


def lambda_handler(event, context):
    print('Loading function')

    s3 = boto3.client('s3')
    env = os.getenv('ENVIRONMENT')
    speech_items_table_name = os.getenv('SPEECHITEMS_TABLE_NAME')

    if (env == 'local'):
        print("Environment is local, skipping")

        bucket = 'speakaholic-storage-dev202305-dev'
        key = 'private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/inputs/2023-02-06T00:31:03.563Z.jpg'
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
                'Bytes': s3.get_object(Bucket=bucket, Key=key)['Body'].read()
            }
        )

        # get text from rekognition response
        detected_text = ''
        for text_detection in rekognition_response['TextDetections']:
            if 'ParentId' not in text_detection:
                detected_text += text_detection['DetectedText'] + ' '
                print(text_detection['DetectedText'])
                print(text_detection['Type'])

        # boto3 pass s3 file to amazon polly for text to speech
        polly = boto3.client('polly')
        polly_response = polly.synthesize_speech(
            OutputFormat='mp3',
            TextType='ssml',
            Text='<speak> %s </speak>' % (detected_text),
            VoiceId=dynamo_response['Items'][0]['voice'],
            Engine='neural'
        )

        s3.put_object(
            Body=polly_response['AudioStream'].read(),
            Bucket=bucket,
            Key=file_output_path
        )

        # update dynamo db with new file size
        table.update_item(
            Key={
                'id': dynamo_response['Items'][0]['id']
            },
            UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key, character_count = :character_count',
            ExpressionAttributeValues={
                ':is_processed': True,
                ':s3_output_key': file_output_path,
                ':character_count': len(detected_text) - 1
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
