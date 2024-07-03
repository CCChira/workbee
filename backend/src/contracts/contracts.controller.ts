import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
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
import { CreateContractDto } from './dto/createContract.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../services/aws-s3.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

const contract: Contract = {
  id: 0,
  title: '',
  startDate: '',
  endDate: '',
  description: '',
  clientId: '',
  pdfUrl: '',
};

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
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
  @Get('top5contracts')
  @HttpCode(HttpStatus.OK)
  public async getTopContracts() {
    return this.contractsService.getTopContracts();
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

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('pdf'))
  @ApiConsumes('multipart/form-data') // Indicates the endpoint accepts form-data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pdf: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        startDate: {
          type: 'string',
        },
        endDate: {
          type: 'string',
        },
      },
    },
  })
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  public async createContract(
    @Body() createContractDto: CreateContractDto,
    @UploadedFile() pdf: Express.Multer.File,
    @Query('clientId') clientId: string,
  ) {
    const bucketName = 'workbee-files';
    const fileKey = `contracts/${Date.now()}-${'test'}`;
    let pdfUrl = '';
    if (pdf)
      pdfUrl = await this.awsS3Service.uploadFile(
        bucketName,
        fileKey,
        pdf.buffer,
      );
    createContractDto.pdfUrl = pdfUrl ? pdfUrl : '';
    return this.contractsService.createContract(createContractDto, clientId);
  }
}
