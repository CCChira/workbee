import { Module } from '@nestjs/common';
import { TaskTemplatesController } from './tasktemplates.controller';
import { TaskTemplatesService } from './tasktemplates.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskTemplatesController],
  providers: [TaskTemplatesService, PrismaService, JwtService],
})
export class TaskTemplatesModule {}
