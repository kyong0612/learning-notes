// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    jsonschema2, err := UnmarshalJsonschema2(bytes)
//    bytes, err = jsonschema2.Marshal()

package main

import "encoding/json"

func UnmarshalJsonschema2(data []byte) (Jsonschema2, error) {
	var r Jsonschema2
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Jsonschema2) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// Defines the allowed cloud resource types for AWS and GCP
type Jsonschema2 string

const (
	AwsEc2      Jsonschema2 = "AWS_EC2"
	AwsIam      Jsonschema2 = "AWS_IAM"
	AwsRDS      Jsonschema2 = "AWS_RDS"
	GcpCloudSQL Jsonschema2 = "GCP_CLOUD_SQL"
	GcpGce      Jsonschema2 = "GCP_GCE"
	GcpGcs      Jsonschema2 = "GCP_GCS"
)
