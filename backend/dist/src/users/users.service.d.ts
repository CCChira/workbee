import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { CreateUserDto } from './dto/user.dto';
import { GenerateUserDto } from './dto/generateUser.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        loginCode: string;
    }>;
    generateUser(generateUserDto: GenerateUserDto): Promise<void>;
    userExists(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        loginCode: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllUserByRole(role: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        loginCode: string;
    }[]>;
    findUser(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        loginCode: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllUsers({ page, limit, offset, size }: Pagination, sort?: Sorting): Promise<{
        data: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            loginCode: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
}
