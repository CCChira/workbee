import { UsersService } from './users.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';
export declare class UsersController {
    private readonly usersService;
    private readonly smsProvider;
    private readonly logger;
    constructor(usersService: UsersService, smsProvider: DummyProvider);
    getUsers(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getUser({ id }: {
        id: string;
    }): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(userId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateUser(generateUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        registered: boolean;
    }>;
    patchUsers(deleteMultipleUsersDto: DeleteMultipleUsersDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
