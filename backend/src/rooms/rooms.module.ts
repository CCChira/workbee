import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PrismaImageService } from '../services/createImage.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AwsS3Service } from '../services/aws-s3.service';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    PrismaImageService,
    PrismaService,
    JwtService,
    AwsS3Service,
  ],
})
export class RoomsModule {}
