import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    phoneNumber?: string;
    name?: string;
    password?: string;
    role?: Role;
}
