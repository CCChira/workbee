import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Role } from '@prisma/client';
import { LocationsService } from './locations.service';
import {
  Pagination,
  PaginationParamsDecorator,
} from '../utils/decorator/paginationParams.decorator';
import {
  Sorting,
  SortingParamsDecorator,
} from '../utils/decorator/sortingParams.decorator';
import {
  ISearch,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';
import { CreateLocationDto } from './dto/createLocation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('/byContract')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getLocationsByContractId(
    @Query('contractId') contractId: string,
  ) {
    console.log(contractId);
    return this.locationsService.getLocationsByContractId(parseInt(contractId));
  }
  @Get('/withContractAndClient')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  @PagSortApiQuery()
  public async getLocationsWithContractAndClient(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['name', 'id']) sortingParams: Sorting,
  ) {
    return this.locationsService.getLocationsWithContractAndClient(
      paginationParams,
      sortingParams,
    );
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getLocations(
    @Query('clientId') clientId: string,
    @Query('contractId') contractId: string,
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['name', 'id'])
    sortingParams: Sorting,
    @SearchDecorator('email') searchParams: ISearch,
  ) {
    return this.locationsService.findLocations(
      clientId,
      contractId,
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getLocation(@Param() { id }: { id: number }) {
    return this.locationsService.findLocation(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async createLocation(
    @Body() locationDto: CreateLocationDto,
    @Query() contractId: number,
  ) {
    return this.locationsService.createLocation(locationDto, contractId);
  }
  @Post('/multiple')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async createMultipleLocations(
    @Body() locations: CreateLocationDto[],
    @Query('contractId') contractId: string,
  ) {
    return this.locationsService.createMultipleLocations(
      locations,
      parseInt(contractId),
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async updateLocation(
    @Param('id') id: number,
    @Body() locationDto: CreateLocationDto,
  ) {
    return this.locationsService.updateLocation(id, locationDto);
  }
}
