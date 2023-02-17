import json
import boto3
import os
import datetime


sample_event = [{'eventID': '8700ed2b61410c6dac0001853f791777', 'eventName': 'MODIFY', 'eventVersion': '1.1', 'eventSource': 'aws:dynamodb', 'awsRegion': 'us-east-1', 'dynamodb': {'ApproximateCreationDateTime': 1676339532, 'Keys': {'id': {'S': '97f0369c-7ae5-47e1-b24e-fb12cdd91fae'}}, 'NewImage': {'is_processed': {'BOOL': True}, 'voice': {'S': 'Salli'}, '_lastChangedAt': {'N': '1676339468186'}, '__typename': {'S': 'SpeechItems'}, 'language': {'S': 'English'}, 's3_input_key': {'S': 'inputs/2023-02-14T01:51:05.914Z.txt'}, 'prediction_type': {'S': 'texttospeech'}, 'createdAt': {'S': '2023-02-14T01:51:08.164Z'}, 'cognito_user_name': {'S': 'e932ecef-b85f-45dc-9f65-7c6c752fa672'}, 's3_output_key': {'S': 'private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/2023-02-14T01:51:05.914Z.mp3'}, 'name': {'S': 'Test'}, 'created_date_utc': {'S': '2023-02-14T01:51:06.509Z'}, 'id': {'S': '97f0369c-7ae5-47e1-b24e-fb12cdd91fae'}, '_version': {'N': '1'},
                                                                                                                                                                                                                                                                                                           'character_count': {'N': '4'}, 'updatedAt': {'S': '2023-02-14T01:51:08.164Z'}}, 'OldImage': {'is_processed': {'BOOL': False}, 'voice': {'S': 'Salli'}, '_lastChangedAt': {'N': '1676339468186'}, '__typename': {'S': 'SpeechItems'}, 'language': {'S': 'English'}, 's3_input_key': {'S': 'inputs/2023-02-14T01:51:05.914Z.txt'}, 'prediction_type': {'S': 'texttospeech'}, 'createdAt': {'S': '2023-02-14T01:51:08.164Z'}, 'cognito_user_name': {'S': 'e932ecef-b85f-45dc-9f65-7c6c752fa672'}, 'name': {'S': 'Test'}, 'created_date_utc': {'S': '2023-02-14T01:51:06.509Z'}, 'id': {'S': '97f0369c-7ae5-47e1-b24e-fb12cdd91fae'}, '_version': {'N': '1'}, 'character_count': {'N': '4'}, 'updatedAt': {'S': '2023-02-14T01:51:08.164Z'}}, 'SequenceNumber': '72613500000000000159341218', 'SizeBytes': 908, 'StreamViewType': 'NEW_AND_OLD_IMAGES'}, 'eventSourceARN': 'arn:aws:dynamodb:us-east-1:744137563977:table/SpeechItems-iwlprpgqjrhr3d34x4jcfvrp74-dev/stream/2023-01-29T16:54:19.256'}]

# # convert sample_event to json
# sample_event = json.dumps(sample_event)


def lambda_handler(event, context):
    print('Loading function')

    env = os.getenv('ENVIRONMENT')
    user_credits_left_table_name = os.getenv('USERCREDITSLEFT_TABLE_NAME')
    index_name = 'cognito_user_name-index'

    for table_event in event:
        if (env == 'local'):
            print("Environment is local, skipping")

            user_credits_left_table_name = 'UserCreditsLeft-iwlprpgqjrhr3d34x4jcfvrp74-dev'
        else:
            print('Environment is not local, processing')

        try:
            event_name = table_event['eventName']

            # return out of the function if the event is not INSERT
            if 'MODIFY' not in event_name:
                print('Event is not \'MODIFY\', exiting')
                return

            # get the number of credits purchased and cognito_user_name from the json
            cognito_user_name = table_event['dynamodb']['NewImage']['cognito_user_name']['S']
            character_count_used = table_event['dynamodb']['NewImage']['character_count']['N']
            print('User %s used %s credits' %
                  (cognito_user_name, character_count_used))

            # check dynamodb UserCreditsLeft table to see if we have a record for that cognito_user_name
            # if we do we will add the credits to the current user's credits left
            # otherwise we will create a new record with the correct amount of credits
            # boto3 lookup record in dynamo db
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table(user_credits_left_table_name)
            dynamo_response = table.query(
                IndexName=index_name,
                KeyConditionExpression='cognito_user_name = :cognito_user_name',
                ExpressionAttributeValues={
                    ':cognito_user_name': cognito_user_name
                }
            )

            # get the records count from the dynamo response
            records_count = len(dynamo_response['Items'])

            if records_count == 0:
                print('Could not find any credit records for the user.')
                return

            # make sure is_processed is true
            if table_event['dynamodb']['NewImage']['is_processed']['BOOL'] == False:
                print(
                    'This item was not successfully processed due to an error. Credits will not be deducted from the user. Exiting')
                return

            current_credits_left = dynamo_response['Items'][0]['credits_left']

            remaining_credits = int(current_credits_left) - \
                int(character_count_used)

            # get the current utc date time
            now = datetime.datetime.utcnow()

            # convert now to dynamo supported format
            now = now.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            # Update the user credits left current amount + purchased credits
            table.update_item(
                Key={
                    'id': dynamo_response['Items'][0]['id']
                },
                UpdateExpression='SET credits_left = :credits_left, credits_left_as_of = :credits_left_as_of, updatedAt = :updatedAt',
                ExpressionAttributeValues={
                    ':credits_left': remaining_credits,
                    ':credits_left_as_of': now,
                    ':updatedAt': now
                }
            )
        except Exception as e:
            print(e)
            raise e


if __name__ == "__main__":
    lambda_handler(sample_event, None)
