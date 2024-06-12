import { UsersService } from './users.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';
import { InviteUserDto } from './dto/inviteUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
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
    getClients(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
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
    getEmployees(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: ({
            _count: {
                TaskAssignment: number;
            };
        } & {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getEmployeeDetails({ id }: {
        id: string;
    }): Promise<{
        TaskAssignment: ({
            task: {
                id: number;
                _count: {
                    taskSchedule: number;
                    room: number;
                    TaskAssignment: number;
                };
            };
        } & {
            taskId: number;
            userId: string;
        })[];
    } & {
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
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
    generateUser(inviteUserDto: InviteUserDto): Promise<void>;
    createUser(createUser: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    patchUsers(deleteMultipleUsersDto: DeleteMultipleUsersDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
