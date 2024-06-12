import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('messages')
export class ChatController {
  constructor(private readonly messageService: ChatService) {}

  @Get(':senderId/:receiverId')
  async getMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    const messages = await this.messageService.getMessagesBetweenUsers(
      senderId,
      receiverId,
    );
    return { messages };
  }
}
