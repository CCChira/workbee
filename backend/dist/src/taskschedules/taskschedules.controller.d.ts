import { CreateTaskScheduleDto } from './dto/createTaskSchedule.dto';
import { Prisma } from '@prisma/client';
import { TaskSchedulesService } from './taskschedules.service';
import { RequestsService } from '../requests/requests.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class TaskSchedulesController {
    private readonly taskScheduleService;
    private readonly requestsService;
    private readonly prisma;
    constructor(taskScheduleService: TaskSchedulesService, requestsService: RequestsService, prisma: PrismaService);
    createTaskSchedule(createTaskScheduleDto: CreateTaskScheduleDto): Promise<{
        id: number;
        type: import(".prisma/client").$Enums.RequestType;
        status: import(".prisma/client").$Enums.Status;
        details: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        assignedToId: string;
        createdById: string;
    }>;
    createTaskScheduleAdmin(createTaskScheduleDto: CreateTaskScheduleDto): Promise<{
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
    }>;
}
