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
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;
  constructor(private readonly prismaService: PrismaService) {}

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
  handleJoinRoom(
    client: Socket,
    data: { senderId: string; receiverId: string },
  ) {
    const { senderId, receiverId } = data;

    console.log(senderId, receiverId);
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
    await this.prismaService.message.create({
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
      .emit('message', data);
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
}
