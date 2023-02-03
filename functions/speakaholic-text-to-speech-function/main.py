import json
import urllib.parse
import boto3
import os

print('Loading function')

s3 = boto3.client('s3')
env = os.getenv('ENVIRONMENT')
speech_items_table_name = os.getenv('SPEECHITEMS_TABLE_NAME')


def lambda_handler(event, context):
    if (env == 'local'):
        print("Environment is local, skipping")

        bucket = 'speakaholic-storage-dev202305-dev'
        key = 'private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/2023-02-03T10:07:25.601Z.txt'
        speech_items_table_name = 'SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev'
    else:
        print('Environment is not local, processing')
        print("Received event: " + json.dumps(event, indent=2))

        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(
            event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    dynamo_lookup_key = key.split('/')[2]

    print('Looking up key %s in bucket %s' % (dynamo_lookup_key, bucket))

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

        s3_response = s3.get_object(Bucket=bucket, Key=key)

        # read text from s3 object
        text = s3_response['Body'].read().decode('utf-8')

        # boto3 pass s3 file to amazon polly for text to speech
        polly = boto3.client('polly')
        polly_response = polly.synthesize_speech(
            OutputFormat='mp3',
            TextType='ssml',
            Text='<speak> %s </speak>' % (text),
            VoiceId=dynamo_response['Items'][0]['voice']
        )

        # save polly response to s3
        s3.put_object(
            Body=polly_response['AudioStream'].read(),
            Bucket=bucket,
            Key=key.replace('.txt', '.mp3')
        )

        # update dynamo db with new file size
        table.update_item(
            Key={
                'id': dynamo_response['Items'][0]['id']
            },
            UpdateExpression='SET is_processed = :is_processed, s3_output_key = :s3_output_key',
            ExpressionAttributeValues={
                ':is_processed': True,
                ':s3_output_key': key.replace('.txt', '.mp3')
            }
        )
    except Exception as e:
        print(e)
        raise e


if __name__ == "__main__":
    lambda_handler(None, None)
