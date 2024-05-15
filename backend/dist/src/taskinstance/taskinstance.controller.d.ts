import { TaskinstanceService } from './taskinstance.service';
import { Prisma } from '@prisma/client';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { RequestsService } from '../requests/requests.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class TaskinstanceController {
    private readonly taskInstanceService;
    private readonly requestService;
    private readonly prisma;
    constructor(taskInstanceService: TaskinstanceService, requestService: RequestsService, prisma: PrismaService);
    createTaskInstance(createTaskInstanceDto: CreateTaskInstanceDto): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    updateTaskInstance(instanceId: string, updateTaskInstanceDto: CreateTaskInstanceDto): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }>;
    deleteTaskInstance(instanceId: string): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }>;
    getTaskInstance(instanceId: string): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }>;
    getTaskInstancesByTaskScheduleId(taskScheduleId: string): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }[]>;
    getTaskInstancesByDateInterval(startDate: string, endDate: string): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }[]>;
    getTasksAssignedToUser(userId: string): Promise<({
        taskSchedule: {
            id: number;
            taskTemplateId: number;
            description: string;
            dayOfWeek: number[];
            frequency: number[];
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            status: import(".prisma/client").$Enums.Status;
            hour: string;
            roomId: number;
        };
        room: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
    } & {
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    })[]>;
    getTasksAssignedToUserWithinInterval(userId: string, startDate: string, endDate: string): Promise<({
        taskSchedule: {
            id: number;
            taskTemplateId: number;
            description: string;
            dayOfWeek: number[];
            frequency: number[];
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            status: import(".prisma/client").$Enums.Status;
            hour: string;
            roomId: number;
        };
        room: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
    } & {
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    })[]>;
    getAllTaskInstances(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch): Promise<{
        data: {
            id: number;
            taskScheduleId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    assignUserToTaskInstance(instanceId: string, userId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
}
