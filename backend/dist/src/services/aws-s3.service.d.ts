/// <reference types="node" />
export declare class AwsS3Service {
    private readonly s3Client;
    private readonly logger;
    constructor();
    uploadFile(bucketName: string, fileKey: string, fileBuffer: Buffer): Promise<string>;
    getFileUrl(bucketName: string, fileKey: string): Promise<string>;
}
