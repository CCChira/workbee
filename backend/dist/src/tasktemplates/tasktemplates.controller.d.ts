import { CreateTaskTemplateDto } from './dto/createTaskTemplate.dto';
import { TaskTemplatesService } from './tasktemplates.service';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
export declare class TaskTemplatesController {
    private readonly taskTemplateService;
    constructor(taskTemplateService: TaskTemplatesService);
    createTaskTemplate(dto: CreateTaskTemplateDto): Promise<{
        id: number;
        title: string;
        necessaryWorkers: number;
        necessaryTools: string[];
        contractId: number;
        duration: string;
    }>;
    createMultipleTaskTemplates(dto: CreateTaskTemplateDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getTaskTemplatesCount(): Promise<{
        totalCount: number;
        usedCount: number;
        instancesToday: number;
        instancesNext7Days: number;
    }>;
    getTaskTemplate({ id }: {
        id: string;
    }): Promise<{
        id: number;
        title: string;
        necessaryWorkers: number;
        necessaryTools: string[];
        contractId: number;
        duration: string;
    }>;
    getTaskTemplates(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch, contractId: string): Promise<{
        data: {
            TaskSchedule: {
                id: number;
                description: string;
                status: import(".prisma/client").$Enums.Status;
                isActive: boolean;
            }[];
            id: number;
            _count: {
                TaskSchedule: number;
            };
            title: string;
            necessaryWorkers: number;
            necessaryTools: string[];
            contractId: number;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
}
