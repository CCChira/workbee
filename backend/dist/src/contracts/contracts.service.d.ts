import { PrismaService } from '../prisma/prisma.service';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllContracts({ page, limit, offset, size }: Pagination, sort?: Sorting, search?: ISearch): Promise<{
        data: {
            id: number;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            clientId: string;
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
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
}
