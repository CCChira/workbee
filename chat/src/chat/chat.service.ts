// src/chat/message/message.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMessagesBetweenUsers(senderId: string, receiverId: string) {
    return this.prismaService.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });
  }
}
