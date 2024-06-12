import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {LocationGateway} from "./websocket.gateway";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LocationGateway],
})
export class AppModule {}
