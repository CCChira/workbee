/// <reference types="multer" />
import { RoomsService } from './rooms.service';
import { AwsS3Service } from '../services/aws-s3.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
export declare class RoomsController {
    private readonly roomsService;
    private readonly awsS3Service;
    constructor(roomsService: RoomsService, awsS3Service: AwsS3Service);
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
    getRooms(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
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
        dataSize: number;
        page: number;
        size: number;
    }>;
    getRoomWithImages(id: string): Promise<{
        message: string;
        room: {
            images: {
                originalUrl: string;
                presignedUrl: string;
            }[];
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
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
    }>;
    createRoomWithImages(files: Express.Multer.File[], body: CreateRoomDto): Promise<{
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
}
