import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class PrismaImageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createImagesForRoom(roomId: number, imageUrls: string[]): Promise<Prisma.BatchPayload>;
}
