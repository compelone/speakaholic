terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "prod/lambdas/speakaholic-polly-synthesis-complete-function"
    region = "us-east-1"
  }
}

locals {
  vars = merge(
    yamldecode(file("../../environment.yaml"))
  )
  service_name = "speakaholic-polly-synthesis-complete-function"
  bucket_arn   = "arn:aws:s3:::speakaholic-storage111412-production"
  bucket_name  = "speakaholic-storage111412-production"
  sqs_arn      = "arn:aws:sqs:us-east-1:744137563977:production-polly-updates-queue"
}

resource "aws_lambda_function" "speakaholic_polly_synthesis_complete_function" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "../../../../functions/${local.service_name}/${local.service_name}.zip"
  function_name = "${local.service_name}-${local.vars.environment}"
  role          = aws_iam_role.speakaholic_polly_synthesis_complete_function.arn
  handler       = "main.lambda_handler"
  layers        = ["arn:aws:lambda:us-east-1:744137563977:layer:boto3-layer:2", "arn:aws:lambda:us-east-1:744137563977:layer:requestsLayer:1"]
  timeout       = 300
  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256("../../../../functions/${local.service_name}/${local.service_name}.zip")

  runtime = "python3.8"

  environment {
    variables = {
      ENVIRONMENT            = "${local.vars.environment}"
      SPEECHITEMS_TABLE_NAME = "SpeechItems-5k4nw2ylcvgsrho4e5brufqfya-${local.vars.environment}"
      USERCREDITS_TABLE_NAME = "UserCreditsLeft-5k4nw2ylcvgsrho4e5brufqfya-${local.vars.environment}"
    }
  }

  tags = {
    "Name"        = "${local.service_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

# This is to optionally manage the CloudWatch Log Group for the Lambda Function.
# If skipping this resource configuration, also add "logs:CreateLogGroup" to the IAM policy below.
resource "aws_cloudwatch_log_group" "speakaholic_polly_synthesis_complete_function" {
  name              = "/aws/lambda/${local.service_name}-${local.vars.environment}"
  retention_in_days = 14
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
resource "aws_iam_policy" "speakaholic_polly_synthesis_complete_function" {
  name        = "${local.service_name}-${local.vars.environment}"
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

resource "aws_iam_role" "speakaholic_polly_synthesis_complete_function" {
  name = "${local.service_name}-role-${local.vars.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = aws_iam_policy.speakaholic_polly_synthesis_complete_function.arn
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function2" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonTextractFullAccess"
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function21" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function22" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function23" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "speakaholic_polly_synthesis_complete_function25" {
  role       = aws_iam_role.speakaholic_polly_synthesis_complete_function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_sns_topic" "speakaholic_polly_synthesis_complete_function" {
  name = "${local.service_name}-topic-${local.vars.environment}"
}

resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  alarm_name          = "${local.service_name}-error-alarm-${local.vars.environment}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "This metric monitors errors in the Lambda function."
  alarm_actions       = [aws_sns_topic.speakaholic_polly_synthesis_complete_function.arn]

  dimensions = {
    FunctionName = aws_lambda_function.speakaholic_polly_synthesis_complete_function.function_name
  }
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.speakaholic_polly_synthesis_complete_function.arn
  protocol  = "email"
  endpoint  = "support@byitl.com"
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.speakaholic_polly_synthesis_complete_function.arn
  principal     = "s3.amazonaws.com"
  source_arn    = local.bucket_arn
}

