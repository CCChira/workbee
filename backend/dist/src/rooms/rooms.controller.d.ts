/// <reference types="multer" />
import { RoomsService } from './rooms.service';
import { AwsS3Service } from '../services/aws-s3.service';
import { CreateRoomDto } from './dto/createRoom.dto';
export declare class RoomsController {
    private readonly roomsService;
    private readonly awsS3Service;
    constructor(roomsService: RoomsService, awsS3Service: AwsS3Service);
    getRoomsFromLocation(locationId: string): Promise<{
        data: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        }[];
    }>;
    getRoomWithImages(id: string): Promise<{
        message: string;
        room: {
            images: {
                originalUrl: string;
                presignedUrl: string;
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
