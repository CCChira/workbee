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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const rooms_service_1 = require("./rooms.service");
const aws_s3_service_1 = require("../services/aws-s3.service");
const platform_express_1 = require("@nestjs/platform-express");
const createRoom_dto_1 = require("./dto/createRoom.dto");
const swagger_1 = require("@nestjs/swagger");
const room = {
    id: 0,
    name: '',
    locationId: 0,
    accessMode: client_1.AccessMode.STAIRS,
};
let RoomsController = class RoomsController {
    constructor(roomsService, awsS3Service) {
        this.roomsService = roomsService;
        this.awsS3Service = awsS3Service;
    }
    async getRoomsByLocationId(locationId, pagination, sorting) {
        return this.roomsService.getRoomsByLocationId(locationId, pagination, sorting);
    }
    async getRoomWithImages(id) {
        const bucketName = 'workbee-files';
        const room = await this.roomsService.getRoomWithImages(parseInt(id));
        if (!room) {
            return {
                message: `Room with ID ${id} not found`,
                room: null,
            };
        }
        const imagesWithPresignedUrls = await Promise.all(room.images.map(async (image) => {
            const s3UrlPrefix = `https://${bucketName}.s3.eu-north-1.amazonaws.com/`;
            const key = image.url.startsWith(s3UrlPrefix)
                ? image.url.substring(s3UrlPrefix.length)
                : image.url;
            const presignedUrl = await this.awsS3Service.getFileUrl(bucketName, key);
            return {
                originalUrl: image.url,
                presignedUrl,
            };
        }));
        return {
            message: 'Room and images retrieved successfully',
            room: {
                ...room,
                images: imagesWithPresignedUrls,
            },
        };
    }
    async createRoomWithImages(files, body) {
        return this.roomsService.createRoomWithImages(body, files);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Get)('/byLocation/:locationId'),
    __param(0, (0, common_1.Param)('locationId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getRoomsByLocationId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getRoomWithImages", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('imageFiles', 10)),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, createRoom_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "createRoomWithImages", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('Rooms'),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        aws_s3_service_1.AwsS3Service])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map