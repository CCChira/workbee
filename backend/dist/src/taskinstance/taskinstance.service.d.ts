import { PrismaService } from '../prisma/prisma.service';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';
import { UpdateTaskInstanceStatusDto } from './dto/updateTaskInstanceStatus.dto';
export declare class TaskinstanceService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createTaskInstance(taskInstanceDto: CreateTaskInstanceDto): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTaskInstance(instanceId: number, updateTaskInstanceDto: any): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteTaskInstance(instanceId: number): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getTaskInstance(instanceId: number): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    getTaskInstancesByTaskScheduleId(taskScheduleId: number): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }[]>;
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
    findTasksForToday(userId: string): Promise<({
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
    getAllTaskInstances({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
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
    getTaskInstancesByRoomId(roomId: string, { page, limit, offset, size }: Pagination, sort?: Sorting): Promise<{
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
    assignUserToTaskInstance(instanceId: number, userId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
    deleteUserFromTaskInstance(instanceId: number, userId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
    updateTaskInstanceStatus(id: number, updateTaskInstanceStatusDto: UpdateTaskInstanceStatusDto): Promise<{
        id: number;
        taskScheduleId: number;
        taskTemplateId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
        updatedAt: Date;
    }>;
    getStatusCounts(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TaskInstanceGroupByOutputType, "status"[]> & {
        _count: {
            status: number;
        };
    })[]>;
    parseDuration(duration: any): number;
    getRandomDuration(): string;
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
    getUnderstaffedTaskInstances(): Promise<{
        id: number;
        title: string;
        date: string;
        neededWorkers: number;
        assignedWorkers: number;
    }[]>;
    getTaskInstancesThisMonth(): Promise<{}>;
    getTaskStatusCounts(monthRange: {
        start: string;
        end: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.Status;
        count: number;
    }[]>;
    getTaskInstancesByDateState(month: string, year: string, contractId: string, roomId: string, userId: string, includeWorkers: boolean, locationId: string): Promise<{}>;
}
