terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "prod/lambdas/speakaholic-image-to-speech-function"
    region = "us-east-1"
  }
}

resource "aws_lambda_function" "speakaholic_image_to_speech_function" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "../../../../functions/speakaholic-image-to-speech-function/speakaholic-image-to-speech-function.zip"
  function_name = "speakaholic-image-to-speech-function-production"
  role          = "arn:aws:iam::744137563977:role/speakaholic-lambda-s3-predictions"
  handler       = "main.lambda_handler"
  layers        = ["arn:aws:lambda:us-east-1:744137563977:layer:boto3-layer:2", "arn:aws:lambda:us-east-1:744137563977:layer:requestsLayer:1"]
  timeout       = 300
  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../../../../functions/speakaholic-image-to-speech-function/speakaholic-image-to-speech-function.zip")

  runtime = "python3.8"

  environment {
    variables = {
      ENVIRONMENT            = "production"
      SPEECHITEMS_TABLE_NAME = "SpeechItems-5k4nw2ylcvgsrho4e5brufqfya-production"
      SPEECH_KEY             = "d4ad074a80f24b64a16f8709488b9fa4"
      SPEECH_REGION          = "eastus"
    }
  }

  #   depends_on = [
  #     aws_iam_role_policy_attachment.speakaholic_image_to_speech_function,
  #     aws_cloudwatch_log_group.speakaholic_image_to_speech_function,
  #   ]

  tags = {
    "Name"        = "speakaholic-image-to-speech-function"
    "Environment" = "production"
    "IsTerraform" = "true"
  }
}

# This is to optionally manage the CloudWatch Log Group for the Lambda Function.
# If skipping this resource configuration, also add "logs:CreateLogGroup" to the IAM policy below.
resource "aws_cloudwatch_log_group" "speakaholic_image_to_speech_function" {
  name              = "/aws/lambda/speakaholic-image-to-speech-function"
  retention_in_days = 14
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
resource "aws_iam_policy" "speakaholic_image_to_speech_function" {
  name        = "speakaholic-image-to-speech-function-production"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "speakaholic_image_to_speech_function" {
  role       = "speakaholic-lambda-s3-predictions"
  policy_arn = aws_iam_policy.speakaholic_image_to_speech_function.arn
}
