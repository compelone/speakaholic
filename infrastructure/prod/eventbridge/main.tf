terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "prod/eventbridge"
    region = "us-east-1"
  }
}

module "eventbridge" {
  source = "terraform-aws-modules/eventbridge/aws"

  bus_name = "speakaholic-event-bus-prod"

  tags = {
    Name        = "speakaholic-event-bus"
    Environment = "production"
    IsTerraform = "true"
  }
}
