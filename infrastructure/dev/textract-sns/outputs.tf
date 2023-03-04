output "textract_iam_role_arn" {
  description = "ARN of textract IAM role"
  value       = aws_iam_role.textract_sns_role.arn
}
