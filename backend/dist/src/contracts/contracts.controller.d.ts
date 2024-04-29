import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ContractsService } from './contracts.service';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    getContracts(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch): Promise<{
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
    getContractsByClientId(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch, clientId: string): Promise<{
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
