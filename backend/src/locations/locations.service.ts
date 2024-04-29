import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { ContractsService } from '../contracts/contracts.service';
import { CreateLocationDto } from './dto/createLocation.dto';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contractsService: ContractsService,
  ) {}
  createLocation(location: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        ...location,
      },
    });
  }
  updateLocation(id: number, location: CreateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: {
        ...location,
      },
    });
  }
  findLocation(id: number) {
    return this.prisma.location.findUnique({ where: { id } });
  }
  async findLocations(
    clientId?: string,
    contractId?: string,
    paginationParams?: Pagination,
    sortingParams?: Sorting,
    searchParams?: ISearch,
  ) {
    const actualContractId = parseInt(contractId ? contractId : '0');
    const { data } = await this.contractsService.getAllContractsByClientId(
      clientId,
      paginationParams,
    );
    const contractIds = data.map((contract) => contract.id);
    const response = await this.prisma.location.findMany({
      skip: paginationParams.offset ?? 0,
      take: paginationParams.limit ?? 10,
      orderBy: [
        {
          [sortingParams.property || 'id']: sortingParams.direction || 'desc',
        },
      ],

      where:
        searchParams.field && searchParams.searchParam
          ? {
              contractId: actualContractId
                ? actualContractId
                : { in: contractIds },
              [searchParams.field]: {
                contains: searchParams.searchParam,
                mode: 'insensitive',
              },
            }
          : {
              contractId: actualContractId
                ? actualContractId
                : { in: contractIds },
            },
    });
    return {
      data: response,
      dataSize: response.length,
      page: paginationParams.page,
      size: paginationParams.size,
    };
  }
}
