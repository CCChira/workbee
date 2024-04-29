/// <reference types="cookie-parser" />
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login({ email, password }: LoginDto, request: Request, res: Response): Promise<void>;
    refresh(res: Response, req: Request): Promise<void>;
    test(): string;
}
