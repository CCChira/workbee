import { RequestsService } from './requests.service';
import { TaskSchedulesService } from '../taskschedules/taskschedules.service';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { TaskinstanceService } from '../taskinstance/taskinstance.service';
export declare class RequestsController {
    private readonly requestsService;
    private readonly taskScheduleService;
    private readonly taskInstanceService;
    constructor(requestsService: RequestsService, taskScheduleService: TaskSchedulesService, taskInstanceService: TaskinstanceService);
    approveTaskInstanceRequest(requestId: string): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    denyTaskInstanceRequest(requestId: string): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    getAllRequests(paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch, adminId: string): Promise<{
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
            details: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
            assignedToId: string;
            createdById: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
}
