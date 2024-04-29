import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    createAccessToken(userId: string, role: Role): Promise<string>;
    createRefreshToken(userId: string, role: Role): Promise<string>;
    validateToken(token: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email?: string, password?: string): Promise<AuthEntity>;
}
