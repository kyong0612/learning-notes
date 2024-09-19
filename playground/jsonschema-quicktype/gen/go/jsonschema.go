// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    jsonschema, err := UnmarshalJsonschema(bytes)
//    bytes, err = jsonschema.Marshal()

package main

import "encoding/json"

func UnmarshalJsonschema(data []byte) (Jsonschema, error) {
	var r Jsonschema
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Jsonschema) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Jsonschema struct {
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
