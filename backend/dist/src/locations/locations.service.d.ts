import { PrismaService } from '../prisma/prisma.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { ContractsService } from '../contracts/contracts.service';
import { CreateLocationDto } from './dto/createLocation.dto';
export declare class LocationsService {
    private readonly prisma;
    private readonly contractsService;
    constructor(prisma: PrismaService, contractsService: ContractsService);
    createLocation(location: CreateLocationDto, contractId: number): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createMultipleLocations(locations: CreateLocationDto[], contractId: number): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    updateLocation(id: number, location: CreateLocationDto): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findLocation(id: number): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findLocations(clientId?: string, contractId?: string, paginationParams?: Pagination, sortingParams?: Sorting, searchParams?: ISearch): Promise<{
        data: {
            id: number;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            contractId: number;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getLocationsByContractId(contractId: number): Promise<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }[]>;
    getLocationsWithContractAndClient(paginationParams?: Pagination, sortingParams?: Sorting): Promise<{
        data: {
            id: number;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            contractId: number;
        }[];
        total: number;
        page: number;
        size: number;
    }>;
}
