import json
import urllib.parse
import boto3
import os

# TODO: ADD CODE TO UPDATE THE DYNAMO RECORD IF A FAILURE OCCURS


def lambda_handler(event, context):
    print('Loading function')

    env = os.getenv('ENVIRONMENT')
    role_arn = os.getenv('ROLE_ARN')
    sns_topic_arn = os.getenv('SNS_TOPIC_ARN')

    if (env == 'local'):
        print("Environment is local, skipping")

        bucket = 'speakaholic-storage-dev202305-dev'
        key = 'private/us-east-1:c561d778-1605-433a-89ae-361e189b4eea/inputs/2023-03-03T21:10:57.043Z.pdf'
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

    if '.pdf' not in key:
        print('Key does not contain .pdf skipping')
        return

    try:
        # use boto3 to convert pdf to text
        textract = boto3.client('textract')
        response = textract.start_document_text_detection(
            DocumentLocation={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            },
            NotificationChannel={
                'RoleArn': role_arn,
                'SNSTopicArn': sns_topic_arn
            },
            OutputConfig={
                'S3Bucket': bucket,
                'S3Prefix': 'textract-outputs/'
            }
        )

        print(response)
    except Exception as e:
        raise e


# if __name__ == "__main__":
#     lambda_handler(None, None)
