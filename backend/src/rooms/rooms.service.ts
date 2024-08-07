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
  imageGroup: string;
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
    console.log(sortingParams);
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
      include: {
        images: true,
        location: {
          select: {
            name: true,
          },
        },
      },
    });
    const roomsWithSignedUrls = await Promise.all(
      response.map(async (room) => {
        const images = await Promise.all(
          room.images.map(async (image) => {
            const url = await this.s3Service.getFileUrl(
              'workbee-files',
              image.url,
            );
            return { ...image, url };
          }),
        );
        return { ...room, images };
      }),
    );

    return {
      data: roomsWithSignedUrls,
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

    for (const file of files) {
      const s3Url = await this.s3Service.uploadFile(
        'workbee-files',
        `rooms/${name}/${file.originalname}`,
        file.buffer,
      );
      uploadedImageUrls.push(s3Url);
    }

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
      include: { images: true, TaskInstance: true },
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
  async getRooms(pagination: Pagination, sorting: Sorting, search: ISearch) {
    const skip = (pagination.page - 1) * pagination.size;
    const take = pagination.size;
    const orderBy = { [sorting.property]: sorting.direction };
    const rooms = this.prisma.room.findMany({
      skip,
      take: pagination.limit,
      orderBy: {
        [sorting.property]: sorting.direction,
      },
      include: {
        images: true,
        location: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async getRoomsByLocationId(
    locationId: string,
    pagination: Pagination,
    sorting: Sorting,
  ) {
    console.log('skip');
    const skip = (pagination.page - 1) * pagination.size;
    const take = pagination.size;
    const orderBy = { [sorting.property]: sorting.direction };

    const rooms = await this.prisma.room.findMany({
      where: { locationId: parseInt(locationId) },
      skip: undefined,
      take: pagination.limit ?? undefined,
      orderBy: {
        images: {
          _count: 'desc',
        },
      },
      include: {
        images: true,
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    const roomsWithSignedUrls = await Promise.all(
      rooms.map(async (room) => {
        const images = await Promise.all(
          room.images.map(async (image) => {
            const url = await this.s3Service.getFileUrl(
              'workbee-files',
              image.url,
            );
            return { ...image, url };
          }),
        );
        return { ...room, images };
      }),
    );

    const total = await this.prisma.room.count({
      where: { locationId: parseInt(locationId) },
    });

    return {
      data: roomsWithSignedUrls,
      total,
      page: pagination.page,
      size: pagination.size,
    };
  }
}
