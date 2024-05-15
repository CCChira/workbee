import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TaskSchedulesService } from '../taskschedules/taskschedules.service';
import { TaskinstanceService } from '../taskinstance/taskinstance.service';

@Module({
  controllers: [RequestsController],
  providers: [
    RequestsService,
    PrismaService,
    JwtService,
    TaskSchedulesService,
    TaskinstanceService,
  ],
})
export class RequestsModule {}
