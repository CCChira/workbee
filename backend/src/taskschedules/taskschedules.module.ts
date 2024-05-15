import { Module } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TaskSchedulesService } from './taskschedules.service';
import { TaskSchedulesController } from './taskschedules.controller';
import { RequestsService } from '../requests/requests.service';

@Module({
  providers: [TaskSchedulesService, JwtService, PrismaService, RequestsService],
  controllers: [TaskSchedulesController],
})
export class TaskschedulesModule {}
