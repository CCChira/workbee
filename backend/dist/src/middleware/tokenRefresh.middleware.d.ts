/// <reference types="cookie-parser" />
import { NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class TokenRefreshMiddleware implements NestMiddleware {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
