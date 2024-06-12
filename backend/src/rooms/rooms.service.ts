import { Injectable } from '@nestjs/common';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaImageService } from '../services/createImage.service';
import { AccessMode } from '@prisma/client';
import { CreateRoomDto } from './dto/createRoom.dto';
import { AwsS3Service } from '../services/aws-s3.service';

interface CreateRoomInput {
  name: string;
  locationId: number;
  accessMode: AccessMode;
  imageGroup: string; // To identify images associated with the room
}
@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: AwsS3Service,
    private readonly prismaImageService: PrismaImageService,
  ) {}
  async getAllRooms(
    paginationParams: Pagination,
    sortingParams: Sorting,
    searchParam: ISearch,
  ) {
    const response = await this.prisma.room.findMany({
      skip: paginationParams.offset,
      take: paginationParams.limit,
      orderBy: [
        {
          [sortingParams.property || 'id']: sortingParams.direction || 'desc',
        },
      ],
      where:
        searchParam.field && searchParam.searchParam
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

  getRoom(id: number) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  async createRoomWithImages(dto: CreateRoomDto, files: Express.Multer.File[]) {
    const { name, locationId, accessMode } = dto;
    const uploadedImageUrls: string[] = [];

    // Upload files to AWS S3
    for (const file of files) {
      const s3Url = await this.s3Service.uploadFile(
        'workbee-files',
        `rooms/${name}/${file.originalname}`,
        file.buffer,
      );
      uploadedImageUrls.push(s3Url);
    }

    // Persist room and image data in the database
    try {
      const newRoom = await this.prisma.room.create({
        data: {
          name,
          locationId: parseInt(locationId as unknown as string),
          accessMode,
          images: {
            create: uploadedImageUrls.map((url) => ({ url })),
          },
        },
        include: { images: true },
      });

      console.log(
        `Room ${name} created successfully with ${uploadedImageUrls.length} images.`,
      );
      return newRoom;
    } catch (error) {
      console.error('Error while creating the room and saving images:', error);
      throw new Error('Failed to create room and save images.');
    }
  }

  async getRoomWithImages(id: number) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { images: true }, // Ensure images are included in the query
    });
  }

  async getAllRoomsFromContract(locationId: number) {
    return {
      data: await this.prisma.room.findMany({
        where: {
          locationId: locationId,
        },
      }),
    };
  }
}
