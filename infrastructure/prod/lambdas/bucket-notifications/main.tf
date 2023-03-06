terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "prod/lambdas/bucket-notifications"
    region = "us-east-1"
  }
}

locals {
  vars = merge(
    yamldecode(file("../../environment.yaml"))
  )
  bucket_arn  = "arn:aws:s3:::speakaholic-storage111412-production"
  bucket_name = "speakaholic-storage111412-production"
}

resource "aws_s3_bucket_notification" "notification" {
  bucket = local.bucket_name

  lambda_function {
    lambda_function_arn = "arn:aws:lambda:us-east-1:744137563977:function:speakaholic-image-to-speech-function-production"
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".jpg"
  }

  lambda_function {
    lambda_function_arn = "arn:aws:lambda:us-east-1:744137563977:function:speakaholic-text-to-speech-function-production"
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".txt"
  }

  lambda_function {
    lambda_function_arn = "arn:aws:lambda:us-east-1:744137563977:function:speakaholic-pdf-to-speech-function-production"
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".pdf"
  }

  lambda_function {
    lambda_function_arn = "arn:aws:lambda:us-east-1:744137563977:function:speakaholic-polly-synthesis-complete-function-production"
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".mp3"
  }
}
