import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ContractsService, PrismaService, JwtService],
  controllers: [ContractsController],
})
export class ContractsModule {}
