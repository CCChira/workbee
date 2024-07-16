import { TaskinstanceService } from './taskinstance.service';
import { Prisma } from '@prisma/client';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { RequestsService } from '../requests/requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskInstanceStatusDto } from './dto/updateTaskInstanceStatus.dto';
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
    createSingularTaskInstance(createTaskInstanceDto: CreateTaskInstanceDto): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    updateTaskInstance(instanceId: string, updateTaskInstanceDto: CreateTaskInstanceDto): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    removeUserFromTaskInstance(userId: string, taskId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
    deleteTaskInstance(instanceId: string): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    getUnderstaffedTasks(): Promise<{
        id: number;
        title: string;
        date: string;
        neededWorkers: number;
        assignedWorkers: number;
    }[]>;
    fetchTaskLoadAndEfficiency(): Promise<{
        categories: string[];
        seriesVolume: {
            name: string;
            data: number[];
        }[];
        seriesDuration: {
            name: string;
            data: number[];
        }[];
    }>;
    getTaskInstancesToday(userId: string): Promise<({
        taskTemplate: {
            id: number;
            title: string;
            necessaryWorkers: number;
            necessaryTools: string[];
            contractId: number;
            duration: string;
        };
        taskSchedule: {
            taskTemplate: {
                id: number;
                title: string;
                necessaryWorkers: number;
                necessaryTools: string[];
                contractId: number;
                duration: string;
            };
        } & {
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
            location: {
                id: number;
                name: string;
                address: string;
                latitude: number;
                longitude: number;
                contractId: number;
            };
            images: {
                id: number;
                url: string;
                roomId: number;
            }[];
        } & {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
    } & {
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    })[]>;
    getStatusCounts(start: string, end: string): Promise<{
        status: import(".prisma/client").$Enums.Status;
        count: number;
    }[]>;
    getTaskInstancesThisMonth(): Promise<{}>;
    updateTaskInstanceStatus(id: string, updateTaskInstanceStatusDto: UpdateTaskInstanceStatusDto): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    getTaskInstancesByTaskScheduleId(taskScheduleId: string): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }[]>;
    getTaskInstancesByDateState(month: string, year: string, contractId: string, roomId: string, locationId: string, userId: string, includeWorkers: string): Promise<{}>;
    getTaskInstancesByRoomId(roomId: string, paginationParams: Pagination, sortingParams: Sorting): Promise<{
        data: {
            id: number;
            taskScheduleId: number;
            taskTemplateId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
            updatedAt: Date;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getTaskInstancesByDateInterval(startDate: string, endDate: string, contractId: string, roomId: string, locationId: string): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }[]>;
    getTasksAssignedToUser(userId: string): Promise<{
        data: ({
            TaskAssignment: {
                taskId: number;
                userId: string;
            }[];
            taskSchedule: {
                taskTemplate: {
                    id: number;
                    title: string;
                    necessaryWorkers: number;
                    necessaryTools: string[];
                    contractId: number;
                    duration: string;
                };
            } & {
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
                location: {
                    id: number;
                    name: string;
                    address: string;
                    latitude: number;
                    longitude: number;
                    contractId: number;
                };
            };
        } & {
            id: number;
            taskScheduleId: number;
            taskTemplateId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
            updatedAt: Date;
        })[];
    }>;
    getTasksAssignedToUserWithinInterval(userId: string, startDate: string, endDate: string): Promise<({
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
        taskSchedule: {
            taskTemplate: {
                id: number;
                title: string;
                necessaryWorkers: number;
                necessaryTools: string[];
                contractId: number;
                duration: string;
            };
        } & {
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
    } & {
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    })[]>;
    getTasksAssignedToUserThisWeek(userId: string): Promise<({
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
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
    } & {
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    })[]>;
    getAllTaskInstances(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch): Promise<{
        data: {
            id: number;
            taskScheduleId: number;
            taskTemplateId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
            updatedAt: Date;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getTaskInstance(instanceId: string): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    assignUserToTaskInstance(instanceId: string, userId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
}
