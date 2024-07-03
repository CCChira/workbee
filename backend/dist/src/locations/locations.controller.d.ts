import { LocationsService } from './locations.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateLocationDto } from './dto/createLocation.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getLocationsByContractId(contractId: string): Promise<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }[]>;
    getLocationsWithContractAndClient(paginationParams: Pagination, sortingParams: Sorting): Promise<{
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
    getLocations(clientId: string, contractId: string, paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
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
    getLocation({ id }: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }>;
    createLocation(locationDto: CreateLocationDto, contractId: number): Promise<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }>;
    createMultipleLocations(locations: CreateLocationDto[], contractId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateLocation(id: number, locationDto: CreateLocationDto): Promise<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        contractId: number;
    }>;
}
