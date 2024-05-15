/// <reference types="multer" />
import { AccessMode } from '@prisma/client';
export declare class CreateRoomDto {
    name: string;
    locationId: number;
    imageGroup: string;
    accessMode: AccessMode;
    imageFiles: Express.Multer.File[];
}
