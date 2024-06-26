import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';
import { TwilioService } from '../services/twilio.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    JwtService,
    DummyProvider,
    TwilioService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
