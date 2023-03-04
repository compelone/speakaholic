terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "dev/textract-sns"
    region = "us-east-1"
  }
}

locals {
  vars = merge(
    yamldecode(file("../environment.yaml"))
  )
  topic_name = "textract-sns-topic"
}

resource "aws_sns_topic" "textract_sns" {
  name = "${local.vars.environment}-${local.topic_name}"

  tags = {
    "Name"        = "${local.topic_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

resource "aws_sqs_queue" "textract_sqs" {
  name = "${local.vars.environment}-textract-updates-queue"

  tags = {
    "Name"        = "${local.topic_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

resource "aws_sns_topic_subscription" "textract_updates_sqs_target" {
  topic_arn = aws_sns_topic.textract_sns.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.textract_sqs.arn
}

resource "aws_sqs_queue_policy" "textract_updates_queue_policy" {
  queue_url = aws_sqs_queue.textract_sqs.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.textract_sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.textract_sns.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_iam_role" "textract_sns_role" {
  name                = "${local.vars.environment}-${local.topic_name}-role"
  managed_policy_arns = [aws_iam_policy.textract_policy.arn]

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "textract.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    "Name"        = "${local.topic_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

resource "aws_iam_policy" "textract_policy" {
  name = "${local.vars.environment}-${local.topic_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sns:Publish"
        ],
        Resource = "${aws_sns_topic.textract_sns.arn}"
      }
    ]
  })
}
