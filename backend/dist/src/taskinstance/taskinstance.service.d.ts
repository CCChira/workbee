import { PrismaService } from '../prisma/prisma.service';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';
export declare class TaskinstanceService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createTaskInstance(taskInstanceDto: CreateTaskInstanceDto): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTaskInstance(instanceId: number, updateTaskInstanceDto: any): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteTaskInstance(instanceId: number): import(".prisma/client").Prisma.Prisma__TaskInstanceClient<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getTaskInstance(instanceId: number): Promise<{
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    }>;
    getTaskInstancesByTaskScheduleId(taskScheduleId: number): Promise<{
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
    getTasksAssignedToUser(userId: string): Promise<{
        data: ({
            TaskAssignment: {
                taskId: number;
                userId: string;
            }[];
            room: {
                id: number;
                name: string;
                location: {
                    latitude: number;
                    longitude: number;
                };
            };
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
        } & {
            id: number;
            taskScheduleId: number;
            status: import(".prisma/client").$Enums.Status;
            date: Date;
            hour: string;
            roomId: number;
        })[];
    }>;
    getTasksAssignedToUserWithinInterval(userId: string, startDate: string, endDate: string): Promise<({
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
        room: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
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
    } & {
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    })[]>;
    getTasksAssignedToUserThisWeek(userId: string): Promise<({
        TaskAssignment: {
            taskId: number;
            userId: string;
        }[];
        room: {
            id: number;
            name: string;
            locationId: number;
            accessMode: import(".prisma/client").$Enums.AccessMode;
        };
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
    } & {
        id: number;
        taskScheduleId: number;
        status: import(".prisma/client").$Enums.Status;
        date: Date;
        hour: string;
        roomId: number;
    })[]>;
    getAllTaskInstances({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
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
    assignUserToTaskInstance(instanceId: number, userId: string): Promise<{
        taskId: number;
        userId: string;
    }>;
    getStatusCounts(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TaskInstanceGroupByOutputType, "status"[]> & {
        _count: {
            status: number;
        };
    })[]>;
}
