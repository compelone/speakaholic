terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "dev/appconfig/speakaholic-app-config"
    region = "us-east-1"
  }
}

locals {
  vars = merge(
    yamldecode(file("../environment.yaml"))
  )
  service_name     = "speakaholic-app-config"
  application_name = "Speakaholic"
}

resource "aws_appconfig_application" "speakaholic_app_config" {
  name        = local.application_name
  description = "Speakaholic application configuration"

  tags = {
    "Name"        = "${local.service_name}"
    "Environment" = "${local.vars.environment}"
    "IsTerraform" = "true"
  }
}


resource "aws_appconfig_environment" "speakaholic_app_config" {
  name           = "Speakaholic-${local.vars.environment}"
  description    = "Speakaholic AWS AppConfig environment"
  application_id = aws_appconfig_application.speakaholic_app_config.id
}

resource "aws_appconfig_configuration_profile" "speakaholic_app_config" {
  name           = "${local.application_name}-profile"
  application_id = aws_appconfig_application.speakaholic_app_config.id
  description    = "Speakaholic AWS AppConfig configuration profile"
  location_uri   = "hosted"
}

resource "aws_appconfig_deployment_strategy" "example_strategy" {
  name                           = "${local.application_name}-strategy"
  description                    = "Speakaholic AWS AppConfig deployment strategy"
  deployment_duration_in_minutes = 30
  growth_type                    = "LINEAR"
  growth_factor                  = 1.5
  final_bake_time_in_minutes     = 5
  replicate_to                   = "NONE"
}
