// src/aws-s3.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config(); // Load environment variables

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(AwsS3Service.name);

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(
    bucketName: string,
    fileKey: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`File uploaded to S3: ${fileKey}`);
      return fileKey;
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${fileKey}`, error);
      throw new Error('Unable to upload file to S3');
    }
  }

  async getFileUrl(bucketName: string, fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      this.logger.log(`Generated presigned URL for file: ${fileKey}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(
        `Failed to generate signed URL for file: ${fileKey}`,
        error,
      );
      throw new Error('Unable to generate signed URL');
    }
  }
}
