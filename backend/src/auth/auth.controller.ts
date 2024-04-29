import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const authEntity = await this.authService.login(email, password);
      res
        .cookie('access_token', authEntity.accessToken)
        .cookie('refresh_token', authEntity.refreshToken)
        .send(authEntity);
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
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new ForbiddenException('No refresh token provided');
    }
    const { id: userId, role: userRole } =
      await this.authService.validateToken(refreshToken);
    const newAccessToken = await this.authService.createAccessToken(
      userId,
      userRole,
    );
    const newRefreshToken = await this.authService.createRefreshToken(
      userId,
      userRole,
    );
    res.cookie('refresh_token', newRefreshToken);
    res.cookie('access_token', newAccessToken);
  }

  @Get()
  test() {
    return 'test';
  }
}
