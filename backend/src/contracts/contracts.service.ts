import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { CreateContractDto } from './dto/createContract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}
  createContract(createContractDto: CreateContractDto, clientId: string) {
    console.log(createContractDto);
    return this.prisma.contract.create({
      data: {
        clientId: clientId,
        title: createContractDto.title,
        description: createContractDto.description,
        endDate: createContractDto.endDate,
        startDate: createContractDto.startDate,
      },
    });
  }
  async getAllContracts(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.contract.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'desc',
        },
      ],
      where:
        search.field && search.searchParam
          ? {
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : {},
    });
    return {
      data: response,
      dataSize: response.length,
      page,
      size,
    };
  }
  async getAllContractsByClientId(
    clientId: string,
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.contract.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'desc',
        },
      ],
      where:
        search?.field && search?.searchParam
          ? {
              clientId: clientId,
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : { clientId: clientId },
    });
    return {
      data: response,
      dataSize: response.length,
      page,
      size,
    };
  }
}
