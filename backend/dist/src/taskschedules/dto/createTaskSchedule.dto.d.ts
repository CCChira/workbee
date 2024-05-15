export declare class CreateTaskScheduleDto {
    taskTemplateId: number;
    description: string;
    dayOfWeek: number[];
    frequency: number[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    roomId: number;
    hour: string;
    userId: string;
}
