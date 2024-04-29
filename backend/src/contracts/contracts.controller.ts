import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import {
  ISearch,
  SearchApiQuery,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Contract, Role } from '@prisma/client';
import {
  Pagination,
  PaginationParamsDecorator,
} from '../utils/decorator/paginationParams.decorator';
import {
  Sorting,
  SortingParamsDecorator,
} from '../utils/decorator/sortingParams.decorator';
import { ContractsService } from './contracts.service';

const contract: Contract = {
  id: 0,
  title: '',
  startDate: '',
  endDate: '',
  description: '',
  clientId: '',
};

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getContracts(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(Object.keys(contract).map((key) => `${key}`))
    sortingParams: Sorting,
    @SearchDecorator('title') searchParam: ISearch,
  ) {
    return this.contractsService.getAllContracts(
      paginationParams,
      sortingParams,
      searchParam,
    );
  }
  @Get('all')
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async getContractsByClientId(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['title', 'id'])
    sortingParams: Sorting,
    @SearchDecorator('title') searchParam: ISearch,
    @Query('clientId') clientId: string,
  ) {
    return this.contractsService.getAllContractsByClientId(
      clientId,
      paginationParams,
      sortingParams,
      searchParam,
    );
  }
}
