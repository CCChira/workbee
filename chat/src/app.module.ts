import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './websocket.gateway';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ChatModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
