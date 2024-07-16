import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateTaskTemplateDto } from './dto/createTaskTemplate.dto';
import { TaskTemplatesService } from './tasktemplates.service';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Role } from '@prisma/client';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import { ISearch, SearchApiQuery, SearchDecorator } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination, PaginationParamsDecorator } from '../utils/decorator/paginationParams.decorator';
import { Sorting, SortingParamsDecorator } from '../utils/decorator/sortingParams.decorator';

const taskTemplate = {
  id: 0,
  title: '',
  necessaryWorkers: 0,
  necessaryTools: [],
  contractId: 0,
};

@ApiTags('Task Templates')
@Controller('task-templates')
export class TaskTemplatesController {
  constructor(private readonly taskTemplateService: TaskTemplatesService) {}

  @Post()
  @ApiConsumes('application/json')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async createTaskTemplate(@Body() dto: CreateTaskTemplateDto) {
    return this.taskTemplateService.createTaskTemplate(dto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async createMultipleTaskTemplates(@Body() dto: CreateTaskTemplateDto[]) {
    return this.taskTemplateService.createMultipleTaskTemplates(dto);
  }
  @Get('/count')
  @AuthDecorators([Role.ADMIN])
  async getTaskTemplatesCount() {
    return this.taskTemplateService.getTaskTemplatesCount();
  }
  @Get(':id')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskTemplate(@Param() { id }: { id: string }) {
    console.log(id);
    return this.taskTemplateService.findTaskTemplate(parseInt(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskTemplates(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(Object.keys(taskTemplate).map((key) => `${key}`))
    sortingParams: Sorting,
    @SearchDecorator('title') searchParam: ISearch,
    @Query('contractId') contractId: string,
  ) {
    return this.taskTemplateService.findAllTaskTemplates(
      parseInt(contractId),
      paginationParams,
      sortingParams,
      searchParam,
    );
  }
}
