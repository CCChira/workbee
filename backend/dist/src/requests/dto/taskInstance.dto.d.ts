import { Status } from '@prisma/client';
export declare class CreateTaskInstanceDto {
    taskScheduleId: number;
    date: string;
    hour: string;
    status: Status;
    roomId: number;
    userId: string;
}
export declare class UpdateTaskInstanceDto {
    taskScheduleId?: number;
    date?: string;
    hour?: string;
    roomId?: number;
    userId?: string;
}
