import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';
import { TaskTemplatesModule } from './tasktemplates/tasktemplates.module';
import { LocationsModule } from './locations/locations.module';
import { RoomsModule } from './rooms/rooms.module';
import { TokenRefreshMiddleware } from './middleware/tokenRefresh.middleware';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { AwsS3Service } from './services/aws-s3.service';
import { PrismaImageService } from './services/createImage.service';
import { TaskschedulesModule } from './taskschedules/taskschedules.module';
import { RequestsModule } from './requests/requests.module';
import { TaskinstanceModule } from './taskinstance/taskinstance.module';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './services/twilio.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ContractsModule,
    TaskTemplatesModule,
    LocationsModule,
    RoomsModule,
    TaskschedulesModule,
    RequestsModule,
    TaskinstanceModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    JwtStrategy,
    AwsS3Service,
    PrismaImageService,
    TwilioService,
  ],
  exports: [AwsS3Service],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenRefreshMiddleware).forRoutes('*');
  }
}
