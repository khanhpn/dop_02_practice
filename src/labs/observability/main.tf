terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region
}
variable "region" {
  type    = string
  default = "ap-southeast-1"
}
variable "lab_name" {
  type    = string
  default = "dop-observability-tf"
}
variable "notification_email" {
  type    = string
  default = ""
}
data "aws_caller_identity" "current" {}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/dop-study/${var.lab_name}"
  retention_in_days = 7
}
resource "aws_cloudwatch_log_metric_filter" "errors" {
  name           = "${var.lab_name}-errors"
  log_group_name = aws_cloudwatch_log_group.application.name
  pattern        = "{ $.level = \"ERROR\" }"
  metric_transformation {
    name          = "ErrorCount"
    namespace     = "DOPStudy/${var.lab_name}"
    value         = "1"
    default_value = 0
    unit          = "Count"
  }
}
resource "aws_sns_topic" "notifications" {
  name_prefix = "${var.lab_name}-"
}
resource "aws_sns_topic_subscription" "email" {
  count     = var.notification_email == "" ? 0 : 1
  topic_arn = aws_sns_topic.notifications.arn
  protocol  = "email"
  endpoint  = var.notification_email
}
resource "aws_cloudwatch_metric_alarm" "errors" {
  alarm_name          = "${var.lab_name}-errors"
  alarm_description   = "Three structured ERROR records within one minute"
  namespace           = "DOPStudy/${var.lab_name}"
  metric_name         = "ErrorCount"
  statistic           = "Sum"
  unit                = "Count"
  period              = 60
  evaluation_periods  = 1
  datapoints_to_alarm = 1
  threshold           = 3
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.notifications.arn]
}
resource "aws_sns_topic_policy" "notifications" {
  arn = aws_sns_topic.notifications.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowThisCloudWatchAlarm"
      Effect    = "Allow"
      Principal = { Service = "cloudwatch.amazonaws.com" }
      Action    = "sns:Publish"
      Resource  = aws_sns_topic.notifications.arn
      Condition = {
        ArnEquals    = { "aws:SourceArn" = aws_cloudwatch_metric_alarm.errors.arn }
        StringEquals = { "aws:SourceAccount" = data.aws_caller_identity.current.account_id }
      }
    }]
  })
}
resource "aws_sqs_queue" "processing_dlq" {
  name_prefix               = "${var.lab_name}-processing-"
  message_retention_seconds = 604800
  sqs_managed_sse_enabled   = true
}
resource "aws_sqs_queue" "delivery_dlq" {
  name_prefix               = "${var.lab_name}-delivery-"
  message_retention_seconds = 604800
  sqs_managed_sse_enabled   = true
}
resource "aws_sqs_queue" "incidents" {
  name_prefix                = "${var.lab_name}-incidents-"
  message_retention_seconds  = 86400
  visibility_timeout_seconds = 30
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.processing_dlq.arn
    maxReceiveCount     = 3
  })
}
resource "aws_cloudwatch_event_rule" "incident" {
  name_prefix = "${var.lab_name}-"
  event_pattern = jsonencode({
    source        = ["dop.study"]
    "detail-type" = ["PracticeIncident"]
  })
}
resource "aws_sqs_queue_policy" "event_delivery" {
  for_each  = { incidents = aws_sqs_queue.incidents, deadletter = aws_sqs_queue.delivery_dlq }
  queue_url = each.value.url
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowOnlyThisEventBridgeRule"
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = each.value.arn
      Condition = { ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.incident.arn } }
    }]
  })
}
resource "aws_cloudwatch_event_target" "incident" {
  rule      = aws_cloudwatch_event_rule.incident.name
  target_id = "IncidentQueue"
  arn       = aws_sqs_queue.incidents.arn
  dead_letter_config {
    arn = aws_sqs_queue.delivery_dlq.arn
  }
  retry_policy {
    maximum_event_age_in_seconds = 60
    maximum_retry_attempts       = 2
  }
  depends_on = [aws_sqs_queue_policy.event_delivery]
}
output "log_group_name" { value = aws_cloudwatch_log_group.application.name }
output "alarm_name" { value = aws_cloudwatch_metric_alarm.errors.alarm_name }
output "incident_queue_url" { value = aws_sqs_queue.incidents.url }
output "processing_dlq_url" { value = aws_sqs_queue.processing_dlq.url }
output "delivery_dlq_url" { value = aws_sqs_queue.delivery_dlq.url }
output "event_rule_name" { value = aws_cloudwatch_event_rule.incident.name }
