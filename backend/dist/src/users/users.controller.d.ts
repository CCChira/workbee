import { UsersService } from './users.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';
import { InviteUserDto } from './dto/inviteUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly smsProvider;
    private readonly logger;
    constructor(usersService: UsersService, smsProvider: DummyProvider);
    getUsers(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: {
            id: string;
            email: string;
            phoneNumber: string;
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
    topEmployees(): Promise<{
        completedTaskCount: number;
        TaskAssignment: ({
            task: {
                status: import(".prisma/client").$Enums.Status;
            };
        } & {
            taskId: number;
            userId: string;
        })[];
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUtilEmployee(): Promise<{
        employeeId: string;
        name: string;
        taskCounts: {};
    }[]>;
    getClients(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: {
            id: string;
            email: string;
            phoneNumber: string;
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
    getUserChat(userId: string): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getEmployees(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: ({
            _count: {
                TaskAssignment: number;
            };
        } & {
            id: string;
            email: string;
            phoneNumber: string;
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
                    taskTemplate: number;
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
        phoneNumber: string;
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
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(userId: string): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateUser(inviteUserDto: InviteUserDto): Promise<void>;
    validateLogin(token: {
        token: string;
    }): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(createUser: CreateUserDto): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    patchUsers(deleteMultipleUsersDto: DeleteMultipleUsersDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
