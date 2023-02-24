import boto3
import os


def lambda_handler(event, context):
    print('Loading function')

    env = os.getenv('ENVIRONMENT')
    cognito_user_pool_id = os.getenv('COGNITO_USER_POOL_ID')

    for table_event in event:
        if (env == 'local'):
            print("Environment is local, skipping")
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
            client = boto3.client('cognito-idp',  region_name='us-east-1')

            client.admin_delete_user(
                UserPoolId=cognito_user_pool_id,
                Username=cognito_user_name
            )

            print(f'Deleted user {cognito_user_name}')
        except Exception as e:
            print(e)
            raise e


if __name__ == "__main__":
    lambda_handler(None, None)
