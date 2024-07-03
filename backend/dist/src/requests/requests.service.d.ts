import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RequestType, Status } from '@prisma/client';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { UpdateTaskInstanceDto } from './dto/taskInstance.dto';
export declare class RequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRequest(data: {
        type: RequestType;
        details: Prisma.JsonValue;
        createdById: string;
        addressedToId: string;
    }): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    createTaskScheduleRequest(data: {
        details: Prisma.JsonObject;
        createdById: string;
        addressedToId: string;
    }): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    getRequestById(id: number): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    updateRequestStatus(id: number, status: Status): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    getAllRequests(adminId: string, { page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
        data: {
            createdBy: {
                id: string;
                email: string;
                phoneNumber: string;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                password: string;
                createdAt: Date;
                updatedAt: Date;
            };
            id: number;
            type: import(".prisma/client").$Enums.RequestType;
            status: import(".prisma/client").$Enums.Status;
            details: Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            assignedToId: string;
            createdById: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    createTaskInstanceRequest(data: {
        details: Prisma.JsonObject;
        createdById: string;
        addressedToId: string;
    }): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    updateTaskInstanceRequest(id: number, data: UpdateTaskInstanceDto, createdById: string): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
}
