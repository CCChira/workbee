import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskScheduleDto } from './dto/createTaskSchedule.dto';
export declare class TaskSchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateTaskDates;
    createTaskSchedule(dto: CreateTaskScheduleDto): Promise<{
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
