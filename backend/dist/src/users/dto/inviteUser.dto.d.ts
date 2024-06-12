import { Role } from '@prisma/client';
export declare class InviteUserDto {
    email: string;
    phoneNumber: string;
    role: Role;
}
