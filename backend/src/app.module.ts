import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';
import { TasktemplatesModule } from './tasktemplates/tasktemplates.module';
import { LocationsModule } from './locations/locations.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ContractsModule, TasktemplatesModule, LocationsModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
