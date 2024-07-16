import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.url.includes('userChatId')) {
      const accessToken = req.cookies['access_token'];
      const refreshToken = req.cookies['refresh_token'];

      if (!accessToken && refreshToken) {
        try {
          const decoded = this.jwtService.verify(refreshToken, {
            secret: 'zjP9h6ZI5LoSKCRj',
          });
          const newAccessToken = this.jwtService.sign(
            { id: decoded.id, role: decoded.role },
            { expiresIn: '1h', secret: 'zjP9h6ZI5LoSKCRj' },
          );
          const newRefreshToken = this.jwtService.sign(
            { id: decoded.id, tokenId: uuidv4(), role: decoded.role },
            { expiresIn: '7d', secret: 'zjP9h6ZI5LoSKCRj' },
          );

          res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            maxAge: 604800000,
          });
          req.cookies['access_token'] = newAccessToken;
          req.cookies['refresh_token'] = newRefreshToken;

          next();
        } catch (error) {
          throw new UnauthorizedException(
            'Session has expired, please log in again',
          );
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
