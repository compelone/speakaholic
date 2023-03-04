terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "dev/polly-sns"
    region = "us-east-1"
  }
}

locals {
  vars = merge(
    yamldecode(file("../environment.yaml"))
  )
  topic_name = "polly-sns-topic"
}

resource "aws_sns_topic" "polly_sns" {
  name = "${local.vars.environment}-${local.topic_name}"

  tags = {
    "Name"        = "${local.topic_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

resource "aws_sqs_queue" "polly_sqs" {
  name                       = "${local.vars.environment}-polly-updates-queue"
  visibility_timeout_seconds = 300

  tags = {
    "Name"        = "${local.topic_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}

resource "aws_sns_topic_subscription" "polly_updates_sqs_target" {
  topic_arn = aws_sns_topic.polly_sns.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.polly_sqs.arn
}
