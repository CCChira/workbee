import { LocationsService } from './locations.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateLocationDto } from './dto/createLocation.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getLocation({ id }: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        address: string;
        coords: string;
        contractId: number;
    }>;
    getLocations(clientId: string, contractId: string, paginationParams: Pagination, sortingParams: Sorting, searchParams: ISearch): Promise<{
        data: {
            id: number;
            name: string;
            address: string;
            coords: string;
            contractId: number;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    createLocation(locationDto: CreateLocationDto): Promise<{
        id: number;
        name: string;
        address: string;
        coords: string;
        contractId: number;
    }>;
    updateLocation(id: number, locationDto: CreateLocationDto): Promise<{
        id: number;
        name: string;
        address: string;
        coords: string;
        contractId: number;
    }>;
}
