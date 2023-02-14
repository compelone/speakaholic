import json
import boto3
import os
import datetime


sample_event = [{"eventID": "05d22d60308627d180f9228d4edbe112", "eventName": "INSERT", "eventVersion": "1.1", "eventSource": "aws:dynamodb", "awsRegion": "us-east-1", "dynamodb": {"ApproximateCreationDateTime": 1676323469, "Keys": {"id": {"S": "b8fe2939-20fc-49b6-b736-1464b08bd551"}}, "NewImage": {"createdAt": {"S": "2023-02-13T21:24:29.105Z"}, "is_expired": {"BOOL": False}, "cognito_user_name": {"S": "e932ecef-b85f-45dc-9f65-7c6c752fa672"}, "_lastChangedAt": {"N": "1676323469141"}, "credits": {"N": "9000"},
                                                                                                                                                                                                                                                                                                           "__typename": {"S": "PurchaseCredits"}, "id": {"S": "b8fe2939-20fc-49b6-b736-1464b08bd551"}, "expiration_date": {"S": "2023-03-15T20:24:28.489Z"}, "purchase_date": {"S": "2023-02-13T21:24:28.489Z"}, "_version": {"N": "1"}, "updatedAt": {"S": "2023-02-13T21:24:29.105Z"}}, "SequenceNumber": "4819400000000001934448646", "SizeBytes": 348, "StreamViewType": "NEW_AND_OLD_IMAGES"}, "eventSourceARN": "arn:aws:dynamodb:us-east-1:744137563977:table/PurchaseCredits-iwlprpgqjrhr3d34x4jcfvrp74-dev/stream/2023-02-12T19:42:49.845"}]
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
            if 'INSERT' not in event_name:
                print('Event is not \'INSERT\', exiting')
                return

            # get the number of credits purchased and cognito_user_name from the json
            cognito_user_name = table_event['dynamodb']['NewImage']['cognito_user_name']['S']
            credits_purchased = table_event['dynamodb']['NewImage']['credits']['N']
            print('User %s purchased %s credits' %
                  (cognito_user_name, credits_purchased))

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
                # Insert a new record into the table for this user
                # get the current utc date time
                now = datetime.datetime.utcnow()
                # convert now to dynamo supported format
                now = now.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                table.put_item(
                    Item={
                        'id': cognito_user_name,
                        'cognito_user_name': cognito_user_name,
                        'credits_left': credits_purchased,
                        'credits_left_as_of': now,
                        'created_date_utc': now
                    }
                )
            else:
                # get the current users current credits left
                current_credits_left = dynamo_response['Items'][0]['credits_left']
                # convert current_credits_left to int
                current_credits_left = int(
                    current_credits_left) + int(credits_purchased)
                # Update the user credits left current amount + purchased credits
                table.update_item(
                    Key={
                        'id': dynamo_response['Items'][0]['id']
                    },
                    UpdateExpression='SET credits_left = :credits_left, credits_left_as_of = :credits_left_as_of',
                    ExpressionAttributeValues={
                        ':credits_left': current_credits_left,
                        ':credits_left_as_of': current_credits_left,
                    }
                )
        except Exception as e:
            print(e)
            raise e


if __name__ == "__main__":
    lambda_handler(None, None)
