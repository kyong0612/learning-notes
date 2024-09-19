package main

type JsonschemaType struct {
	// AWSクラウドリソースのタイプ
	AwsCloudResourceType AwsCloudResourceType `json:"awsCloudResourceType"`
	// GCPクラウドリソースのタイプ
	GcpCloudResourceType GcpCloudResourceType `json:"gcpCloudResourceType"`
}

// AWSクラウドリソースのタイプ
type AwsCloudResourceType string

const (
	AwsEc2 AwsCloudResourceType = "AWS_EC2"
	AwsIam AwsCloudResourceType = "AWS_IAM"
	AwsRDS AwsCloudResourceType = "AWS_RDS"
)

// GCPクラウドリソースのタイプ
type GcpCloudResourceType string

const (
	GcpCloudSQL GcpCloudResourceType = "GCP_CLOUD_SQL"
	GcpGce      GcpCloudResourceType = "GCP_GCE"
	GcpGcs      GcpCloudResourceType = "GCP_GCS"
)
