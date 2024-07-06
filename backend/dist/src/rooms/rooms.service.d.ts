/// <reference types="multer" />
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaImageService } from '../services/createImage.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { AwsS3Service } from '../services/aws-s3.service';
export declare class RoomsService {
    private readonly prisma;
    private readonly s3Service;
    private readonly prismaImageService;
    constructor(prisma: PrismaService, s3Service: AwsS3Service, prismaImageService: PrismaImageService);
    getAllRooms(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch): Promise<{
        data: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getRoom(id: number): import(".prisma/client").Prisma.Prisma__RoomClient<{
        id: number;
        name: string;
        locationId: number;
        accessMode: import(".prisma/client").$Enums.AccessMode;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createRoomWithImages(dto: CreateRoomDto, files: Express.Multer.File[]): Promise<{
        images: {
            id: number;
            url: string;
            roomId: number;
        }[];
    } & {
        id: number;
        name: string;
        locationId: number;
        accessMode: import(".prisma/client").$Enums.AccessMode;
    }>;
    getRoomWithImages(id: number): Promise<{
        TaskInstance: {
            id: number;
            taskScheduleId: number;
            taskTemplateId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
            updatedAt: Date;
        }[];
        images: {
            id: number;
            url: string;
            roomId: number;
        }[];
    } & {
        id: number;
        name: string;
        locationId: number;
        accessMode: import(".prisma/client").$Enums.AccessMode;
    }>;
    getAllRoomsFromContract(locationId: number): Promise<{
        data: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        }[];
    }>;
    getRoomsByLocationId(locationId: string, pagination: Pagination, sorting: Sorting): Promise<{
        data: {
            images: {
                url: string;
                id: number;
                roomId: number;
            }[];
            location: {
                name: string;
            };
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        }[];
        total: number;
        page: number;
        size: number;
    }>;
}
