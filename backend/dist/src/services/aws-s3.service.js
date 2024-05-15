"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AwsS3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");
dotenv.config();
let AwsS3Service = AwsS3Service_1 = class AwsS3Service {
    constructor() {
        this.logger = new common_1.Logger(AwsS3Service_1.name);
        this.s3Client = new client_s3_1.S3Client({
            region: 'eu-north-1',
            credentials: {
                accessKeyId: 'AKIAXYKJRXR3QBRKPVS6',
                secretAccessKey: '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',
            },
        });
    }
    async uploadFile(bucketName, fileKey, fileBuffer) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: fileBuffer,
        });
        try {
            await this.s3Client.send(command);
            this.logger.log(`File uploaded to S3: ${fileKey}`);
            return fileKey;
        }
        catch (error) {
            this.logger.error(`Failed to upload file to S3: ${fileKey}`, error);
            throw new Error('Unable to upload file to S3');
        }
    }
    async getFileUrl(bucketName, fileKey) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });
        try {
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
                expiresIn: 3600,
            });
            this.logger.log(`Generated presigned URL for file: ${fileKey}`);
            return signedUrl;
        }
        catch (error) {
            this.logger.error(`Failed to generate signed URL for file: ${fileKey}`, error);
            throw new Error('Unable to generate signed URL');
        }
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = AwsS3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map