import { UsersService } from './users.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    getUsers(paginationParams: Pagination, sortingParams: Sorting): Promise<{
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
    generateUser(generateUserDto: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        loginCode: string;
    }>;
}
