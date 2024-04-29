import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class DummyProvider {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    sendSmsCode(email: string, role: Role): Promise<string>;
}
