import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskTemplateDto } from './dto/createTaskTemplate.dto';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
export declare class TaskTemplatesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTaskTemplate(dto: CreateTaskTemplateDto): Promise<{
        id: number;
        title: string;
        necessaryWorkers: number;
        necessaryTools: string[];
        contractId: number;
        duration: string;
    }>;
    createMultipleTaskTemplates(dto: CreateTaskTemplateDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAllTaskTemplates(contractId: number, { page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
        data: {
            id: number;
            _count: {
                TaskSchedule: number;
            };
            title: string;
            necessaryWorkers: number;
            necessaryTools: string[];
            contractId: number;
            TaskSchedule: {
                id: number;
                description: string;
                status: import(".prisma/client").$Enums.Status;
                isActive: boolean;
            }[];
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    findTaskTemplate(taskTemplateId: number): import(".prisma/client").Prisma.Prisma__TaskTemplateClient<{
        id: number;
        title: string;
        necessaryWorkers: number;
        necessaryTools: string[];
        contractId: number;
        duration: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    getTaskTemplatesCount(): Promise<{
        totalCount: number;
        usedCount: number;
        instancesToday: number;
        instancesNext7Days: number;
    }>;
}
