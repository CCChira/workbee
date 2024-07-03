import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('conversation')
  async getConversation(@Query('senderId') senderId: string) {
    return this.appService.getConversation(senderId);
  }
}
