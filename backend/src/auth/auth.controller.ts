import {
  Body,
  Controller,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() { email, password }: LoginDto) {
    try {
      return await this.authService.login(email, password);
    } catch (e) {
      switch (e.status) {
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException(e.message);
        case HttpStatus.FORBIDDEN:
          throw new ForbiddenException(e.message);
        default:
          throw new NotFoundException('There was a problem authenticating');
      }
    }
  }
  @Post()
  logout(@Req() req) {
    req.logOut();
  }
}
