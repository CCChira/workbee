import { Status } from '@prisma/client';
export declare class CreateTaskInstanceDto {
    taskScheduleId: number;
    taskTemplateId: number;
    status: Status;
    date: string;
    hour: string;
    roomId: number;
    userId: string;
}
