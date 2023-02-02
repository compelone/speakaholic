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
        key = 'private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/2023-02-02T19:15:16.324Z.txt'
        speech_items_table_name = 'SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev'
    else:
        print('Environment is not local, processing')
        print("Received event: " + json.dumps(event, indent=2))
        
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')        
        
    dynamo_lookup_key = key.split('/')[2]
    
    print('Looking up key %s in bucket %s' % (dynamo_lookup_key, bucket))
    
    try:
        index_name = 'key-index'
        
        response = s3.get_object(Bucket=bucket, Key=key)
        
        # boto3 lookup record in dynamo db
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(speech_items_table_name)
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression='key = :key',
            ExpressionAttributeValues={
                ':key': dynamo_lookup_key
            }
        )
        
        # read text from s3 object
        text = response['Item']['text']
        
        # boto3 pass s3 file to amazon polly for text to speech
        polly = boto3.client('polly')
        response = polly.synthesize_speech(
            OutputFormat='mp3',
            TextType='ssml',
            Text='<speak> %s </speak>' % (text),
            VoiceId=response['Item']['voice']
        )
        
        # update dynamo db with new file size
        if 'Item' in response:
            print('Updating dynamo db with new file size')
            table.update_item(
                Key={'id': dynamo_lookup_key},
                UpdateExpression="set is_processed = true",
                ExpressionAttributeValues={
                    ':s': response['Item']['size'] + response['Item']['fileSize']
                }
            )
    except Exception as e:
        print(e)
        raise e

if __name__ == "__main__":
    lambda_handler(None, None)
