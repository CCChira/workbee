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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const createImage_service_1 = require("../services/createImage.service");
const aws_s3_service_1 = require("../services/aws-s3.service");
let RoomsService = class RoomsService {
    constructor(prisma, s3Service, prismaImageService) {
        this.prisma = prisma;
        this.s3Service = s3Service;
        this.prismaImageService = prismaImageService;
    }
    async getAllRooms(paginationParams, sortingParams, searchParam) {
        const response = await this.prisma.room.findMany({
            skip: paginationParams.offset,
            take: paginationParams.limit,
            orderBy: [
                {
                    [sortingParams.property || 'id']: sortingParams.direction || 'desc',
                },
            ],
            where: searchParam.field && searchParam.searchParam
                ? {
                    [searchParam.field]: {
                        contains: searchParam.searchParam,
                        mode: 'insensitive',
                    },
                }
                : {},
        });
        return {
            data: response,
            dataSize: response.length,
            page: paginationParams.page,
            size: paginationParams.size,
        };
    }
    getRoom(id) {
        return this.prisma.room.findUnique({
            where: { id },
        });
    }
    async createRoomWithImages(dto, files) {
        const { name, locationId, accessMode } = dto;
        const uploadedImageUrls = [];
        for (const file of files) {
            const s3Url = await this.s3Service.uploadFile('workbee-files', `rooms/${name}/${file.originalname}`, file.buffer);
            uploadedImageUrls.push(s3Url);
        }
        try {
            const newRoom = await this.prisma.room.create({
                data: {
                    name,
                    locationId: parseInt(locationId),
                    accessMode,
                    images: {
                        create: uploadedImageUrls.map((url) => ({ url })),
                    },
                },
                include: { images: true },
            });
            console.log(`Room ${name} created successfully with ${uploadedImageUrls.length} images.`);
            return newRoom;
        }
        catch (error) {
            console.error('Error while creating the room and saving images:', error);
            throw new Error('Failed to create room and save images.');
        }
    }
    async getRoomWithImages(id) {
        return this.prisma.room.findUnique({
            where: { id },
            include: { images: true },
        });
    }
    async getAllRoomsFromContract(locationId) {
        return {
            data: await this.prisma.room.findMany({
                where: {
                    locationId: locationId,
                },
            }),
        };
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        aws_s3_service_1.AwsS3Service,
        createImage_service_1.PrismaImageService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map