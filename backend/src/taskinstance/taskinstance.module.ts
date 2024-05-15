import { Module } from '@nestjs/common';
import { TaskinstanceService } from './taskinstance.service';
import { TaskinstanceController } from './taskinstance.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RequestsService } from '../requests/requests.service';

@Module({
  providers: [TaskinstanceService, JwtService, PrismaService, RequestsService],
  controllers: [TaskinstanceController],
})
export class TaskinstanceModule {}
