import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaImageService {
  constructor(private readonly prisma: PrismaService) {}

  async createImagesForRoom(roomId: number, imageUrls: string[]) {
    const imageCreates: Prisma.ImageCreateManyInput[] = imageUrls.map(
      (url) => ({
        roomId,
        url,
      }),
    );

   
    return this.prisma.image.createMany({
      data: imageCreates,
    });
  }
}
