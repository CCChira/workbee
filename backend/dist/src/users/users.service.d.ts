import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { TwilioService } from '../services/twilio.service';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class UsersService {
    private prisma;
    private twilio;
    constructor(prisma: PrismaService, twilio: TwilioService);
    getTaskCountsByStatusForEmployees(): Promise<{
        employeeId: string;
        name: string;
        taskCounts: {};
    }[]>;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateInviteCode(inviteUserDto: InviteUserDto): Promise<void>;
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
    userExists(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllUserByRole(role: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findUser(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllUsers({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
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
    findAllClients({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
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
    getTopUsersByCompletedTasks(): Promise<{
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
    findAllEmployees({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
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
    deleteMultiple(deleteMultipleUsersDto: DeleteMultipleUsersDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
    getEmployeeDetails(id: string): Promise<{
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
    employeeLogin(payload: {
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
    getUserChat(userId: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phoneNumber: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
