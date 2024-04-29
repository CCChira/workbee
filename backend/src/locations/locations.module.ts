import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ContractsService } from '../contracts/contracts.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService, JwtService, ContractsService],
})
export class LocationsModule {}
