import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AwsS3Service } from '../services/aws-s3.service';

@Module({
  providers: [ContractsService, PrismaService, JwtService, AwsS3Service],
  controllers: [ContractsController],
})
export class ContractsModule {}
