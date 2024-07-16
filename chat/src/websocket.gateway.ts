import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;
  private monolithApiUrl: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.monolithApiUrl = this.configService.get('MONOLITH_URL');
  }

  afterInit(server: Server) {
    console.log(`WebSocket Gateway initialized ${server}`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    data: { senderId: string; receiverId: string },
  ) {
    const { senderId, receiverId } = data;

    if (
      !(await this.prismaService.users.findUnique({ where: { id: senderId } }))
    ) {
      const response = await fetch(
        `${this.monolithApiUrl}/users/getUserChat/?userChatId=${senderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        const errorBody = await response.json();

        throw new Error(errorBody.message || 'Failed to create contract');
      }
      const user = await response.json();
      console.log(user);
      await this.prismaService.users.create({
        data: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role,
        },
      });
    }
    if (
      !(await this.prismaService.users.findUnique({
        where: { id: receiverId },
      }))
    ) {
      const response = await fetch(
        `${this.monolithApiUrl}/users/getUserChat/?userChatId=${receiverId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        const errorBody = await response.json();

        throw new Error(errorBody.message || 'Failed to create contract');
      }
      const user = await response.json();
      await this.prismaService.users.create({
        data: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role,
        },
      });
    }
    this.prismaService.message.updateMany({
      where: {
        senderId: receiverId,
      },
      data: {
        readStatus: true,
      },
    });
    client.join(
      senderId.localeCompare(receiverId) < 0
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { senderId: string; receiverId: string; content: string },
  ) {
    const { senderId, receiverId, content } = data;
    console.log(content);
    const response = await this.prismaService.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });
    this.server
      .to(
        senderId.localeCompare(receiverId) < 0
          ? `${senderId}-${receiverId}`
          : `${receiverId}-${senderId}`,
      )
      .emit('message', {
        senderId,
        receiverId,
        content,
        timestamp: response.timestamp,
        readStatus: response.readStatus,
      });
  }

  @SubscribeMessage('typing')
  async handleTyping(
    client: Socket,
    data: { senderId: string; receiverId: string },
  ) {
    const { senderId, receiverId } = data;

    this.server
      .to(
        senderId.localeCompare(receiverId) < 0
          ? `${senderId}-${receiverId}`
          : `${receiverId}-${senderId}`,
      )
      .emit('typing', data.senderId);
  }
  @SubscribeMessage('read')
  async handleRead(
    client: Socket,
    data: { senderId: string; receiverId: string; messageId: string },
  ) {
    const { senderId, receiverId } = data;
    await this.prismaService.message.update({
      where: {
        id: data.messageId,
      },
      data: {
        readStatus: true,
      },
    });

    this.server
      .to(
        senderId.localeCompare(receiverId) < 0
          ? `${senderId}-${receiverId}`
          : `${receiverId}-${senderId}`,
      )
      .emit('read', data.senderId);
  }
}
