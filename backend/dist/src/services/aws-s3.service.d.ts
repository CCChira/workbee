/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class AwsS3Service {
    private configService;
    private readonly s3Client;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFile(bucketName: string, fileKey: string, fileBuffer: Buffer): Promise<string>;
    getFileUrl(bucketName: string, fileKey: string): Promise<string>;
}
