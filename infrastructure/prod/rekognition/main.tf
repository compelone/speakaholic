
terraform {
  backend "s3" {
    bucket = "byitl-terraform-state"
    key    = "prod/rekognition"
    region = "us-east-1"
  }
}

resource "aws_iam_role_policy" "rekognition" {
  name = "speakaholic_rekognition_s3_policy_production"
  role = "AmazonRekognitionServiceRole"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        "Effect" : "Allow",
        "Resource" : [
          "arn:aws:s3:::speakaholic-storage111412-production/*"
        ]
      }
    ]
  })
}
