export interface JsonschemaType {
    /**
     * AWSクラウドリソースのタイプ
     */
    awsCloudResourceType: AwsCloudResourceType;
    /**
     * GCPクラウドリソースのタイプ
     */
    gcpCloudResourceType: GcpCloudResourceType;
}

/**
 * AWSクラウドリソースのタイプ
 */
export enum AwsCloudResourceType {
    AwsEc2 = "AWS_EC2",
    AwsIam = "AWS_IAM",
    AwsRDS = "AWS_RDS",
}

/**
 * GCPクラウドリソースのタイプ
 */
export enum GcpCloudResourceType {
    GcpCloudSQL = "GCP_CLOUD_SQL",
    GcpGce = "GCP_GCE",
    GcpGcs = "GCP_GCS",
}
