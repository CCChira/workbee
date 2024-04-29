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

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getLocation(@Param() { id }: { id: number }) {
    console.log(id);
    return this.locationsService.findLocation(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getLocations(
    @Query('clientId') clientId: string,
    @Query('contractId') contractId: string,
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['name'])
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

  @Post()
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async createLocation(@Body() locationDto: CreateLocationDto) {
    return this.locationsService.createLocation(locationDto);
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
