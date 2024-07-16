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
  createLocation(location: CreateLocationDto, contractId: number) {
    return this.prisma.location.create({
      data: {
        ...location,
        contractId,
      },
    });
  }
  createMultipleLocations(locations: CreateLocationDto[], contractId: number) {
    console.log(contractId);
    return this.prisma.location.createMany({
      data: locations.map((location) => ({
        ...location,
        contractId,
      })),
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
    console.log(searchParams);
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
              Contract: clientId
                ? {
                    clientId: clientId,
                  }
                : undefined,
              contractId: contractId ? parseInt(contractId) : undefined,
              [searchParams.field]: {
                contains: searchParams.searchParam,
              },
            }
          : {
              Contract: clientId
                ? {
                    clientId: clientId,
                  }
                : undefined,
              contractId: contractId ? parseInt(contractId) : undefined,
            },
    });
    return {
      data: response,
      dataSize: response.length,
      page: paginationParams.page,
      size: paginationParams.size,
    };
  }

  async getLocationsByContractId(contractId: number) {
    console.log(contractId);
    const response = await this.prisma.location.findMany({
      where: {
        contractId: contractId,
      },
    });
    return response;
  }
  async getLocationsWithContractAndClient(
    paginationParams?: Pagination,
    sortingParams?: Sorting,
  ) {
    console.log(paginationParams, sortingParams);
    if (!paginationParams || !sortingParams) {
      const resp = await this.prisma.location.findMany();
      const totalLocations = await this.prisma.location.count();
      return {
        data: resp,
        total: totalLocations,
        page: 1,
        size: 1,
      };
    }

    const locations = await this.prisma.location.findMany({
      skip: paginationParams.offset ?? 0,
      take: paginationParams.limit ?? 10,
      orderBy: {
        [sortingParams.property || 'id']: sortingParams.direction || 'desc',
      },
      include: {
        Contract: {
          include: {
            user: true,
          },
        },
      },
    });
    const totalLocations = await this.prisma.location.count();
    return {
      data: locations,
      total: totalLocations,
      page: paginationParams.page,
      size: paginationParams.size,
    };
  }
}
