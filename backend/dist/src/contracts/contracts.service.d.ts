import { PrismaService } from '../prisma/prisma.service';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { CreateContractDto } from './dto/createContract.dto';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTopContracts(): Promise<({
        taskTemplates: ({
            _count: {
                TaskSchedule: number;
            };
        } & {
            id: number;
            title: string;
            necessaryWorkers: number;
            necessaryTools: string[];
            contractId: number;
            duration: string;
        })[];
    } & {
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    })[]>;
    createContract(createContractDto: CreateContractDto, clientId: string): import(".prisma/client").Prisma.Prisma__ContractClient<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getAllContracts({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
        data: {
            id: number;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            clientId: string;
            pdfUrl: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getAllContractsByClientId(clientId: string, { page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
        data: {
            id: number;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            clientId: string;
            pdfUrl: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getContractById(id: number): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
    updateContract(id: number, updateData: any): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
    deleteContract(id: number): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
}
