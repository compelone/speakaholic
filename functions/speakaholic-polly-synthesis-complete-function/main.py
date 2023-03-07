import json
import urllib.parse
import boto3
import os
import requests

sample_message = {'Records': [{'eventVersion': '2.1', 'eventSource': 'aws:s3', 'awsRegion': 'us-east-1', 'eventTime': '2023-03-05T20:43:24.767Z', 'eventName': 'ObjectCreated:Put', 'userIdentity': {'principalId': 'AWS:AIDA22QQOD5EYVUXIKTHW'}, 'requestParameters': {'sourceIPAddress': '10.0.60.49'}, 'responseElements': {'x-amz-request-id': 'R72HMCEWM99YGBHQ', 'x-amz-id-2': 'yvDhncvuP2q/8OGRGZHX/3qC18CJob90B+vyLCDaA7JlnOi0qxU6juGTUpnKU2cbKoQsB0TAgSELs9uSH5PvrW5fMtXHlakY'}, 's3': {
    's3SchemaVersion': '1.0', 'configurationId': 'tf-s3-lambda-20230305181139687500000001', 'bucket': {'name': 'speakaholic-storage-dev202305-dev', 'ownerIdentity': {'principalId': 'AHMSHBY6RCK69'}, 'arn': 'arn:aws:s3:::speakaholic-storage-dev202305-dev'}, 'object': {'key': 'private/us-east-1%3Ac561d778-1605-433a-89ae-361e189b4eea/.6b626045-5903-4b5c-9caa-2f4c29aae7fd.mp3', 'size': 2342637, 'eTag': '5defc7f4843e0b28b971265224e5d51e', 'sequencer': '006404FEECACBF1862'}}}]}


def lambda_handler(event, context):
    print('Loading function')
    print(event)

    env = os.getenv('ENVIRONMENT')
    speech_items_table_name = os.getenv('SPEECHITEMS_TABLE_NAME')
    user_credits_table_name = os.getenv('USERCREDITS_TABLE_NAME')

    if (env == 'local'):
        print("Environment is local, skipping")

        key = urllib.parse.unquote_plus(
            sample_message['Records'][0]['s3']['object']['key'], encoding='utf-8')
        speech_items_table_name = 'SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev'
        user_credits_table_name = 'UserCreditsLeft-iwlprpgqjrhr3d34x4jcfvrp74-dev'
    else:
        print('Environment is not local, processing')

        key = urllib.parse.unquote_plus(
            event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    # if the key does not contains .mp3
    if '.mp3' not in key:
        print('Key does not contain .mp3 skipping')
        return

    dynamo_lookup_key = key

    try:
        index_name = 's3_output_key-index'

        # boto3 lookup record in dynamo db
        dynamodb = boto3.resource('dynamodb')
        speech_items_table = dynamodb.Table(speech_items_table_name)
        dynamo_response = speech_items_table.query(
            IndexName=index_name,
            KeyConditionExpression='s3_output_key = :s3_output_key',
            ExpressionAttributeValues={
                ':s3_output_key': dynamo_lookup_key
            }
        )

        # if the dynamo response is prediction_type is not pdftospeech then skip
        if (dynamo_response['Items'][0]['prediction_type'] != 'pdftospeech'):
            print('Skipping because prediction type is not pdftospeech')
            return

        # Get the characters used and subtract and update the user credits left table
        characters_used = dynamo_response['Items'][0]['character_count']
        user_credits_table = dynamodb.Table(user_credits_table_name)
        cognito_user_name = dynamo_response['Items'][0]['cognito_user_name']

        user_credits_left_response = user_credits_table.get_item(
            Key={
                'id': cognito_user_name
            }
        )

        result_user_credits_left = user_credits_left_response[
            'Item']['credits_left'] - characters_used

        user_credits_table.update_item(
            Key={
                'id': cognito_user_name
            },
            UpdateExpression='SET credits_left = :result_user_credits_left',
            ExpressionAttributeValues={
                ':result_user_credits_left': result_user_credits_left
            }
        )

        # update the speech items table with is_processed = true
        speech_items_table.update_item(
            Key={
                'id': dynamo_response['Items'][0]['id']
            },
            UpdateExpression='SET is_processed = :is_processed, failed_reason = :failed_reason',
            ExpressionAttributeValues={
                ':is_processed': True,
                ':failed_reason': None
            }
        )

    except Exception as e:
        print(e)
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
