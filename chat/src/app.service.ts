import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Message, Users } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getConversation(senderId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: senderId }, { receiverId: senderId }],
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    const allUsers = await this.prisma.users.findMany({
      where: {
        id: {
          in: messages.map((message) =>
            message.senderId === senderId
              ? message.receiverId
              : message.senderId,
          ),
        },
      },
    });
    const usersSet = allUsers.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, Users>,
    );

    const conversations = messages.reduce(
      (acc, message) => {
        const partnerId =
          message.senderId === senderId ? message.receiverId : message.senderId;

        if (!acc[partnerId]) {
          acc[partnerId] = { user: { ...usersSet[partnerId] }, messages: [] };
        }
        acc[partnerId].messages.push(message);
        return acc;
      },
      {} as Record<string, { user: Users; messages: Message[] }>,
    );

    return Object.entries(conversations)
      .sort(([, messagesA], [, messagesB]) => {
        const latestMessageA = messagesA.messages[0].timestamp;
        const latestMessageB = messagesB.messages[0].timestamp;
        return latestMessageB.getTime() - latestMessageA.getTime();
      })
      .reduce(
        (acc, [partnerId, messages]) => {
          acc[partnerId] = messages;
          return acc;
        },
        {} as Record<string, { user: Users; messages: Message[] }>,
      );
  }
}
