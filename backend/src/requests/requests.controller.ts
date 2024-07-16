import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { TaskSchedulesService } from '../taskschedules/taskschedules.service';
import { CreateTaskScheduleDto } from '../taskschedules/dto/createTaskSchedule.dto';
import { RequestType, Role, Status } from '@prisma/client';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import { ISearch, SearchApiQuery, SearchDecorator } from '../utils/decorator/SearchDecorator.decorator';
import { Pagination, PaginationParamsDecorator } from '../utils/decorator/paginationParams.decorator';
import { Sorting, SortingParamsDecorator } from '../utils/decorator/sortingParams.decorator';
import { TaskinstanceService } from '../taskinstance/taskinstance.service';
import { CreateTaskInstanceDto } from '../taskinstance/dto/createTaskInstance.dto';

@Controller('requests')
@ApiTags('Requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly taskScheduleService: TaskSchedulesService,
    private readonly taskInstanceService: TaskinstanceService,
  ) {}

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN])
  async approveTaskInstanceRequest(@Param('id') requestId: string) {
    const request = await this.requestsService.getRequestById(
      parseInt(requestId),
    );
    if (
      request.type === RequestType.TASK_INSTANCE_CREATION &&
      request.status === Status.PENDING
    ) {
      await this.taskInstanceService.createTaskInstance(
        request.details as unknown as CreateTaskInstanceDto,
      );
      return this.requestsService.updateRequestStatus(
        parseInt(requestId),
        Status.VERIFIED,
      );
    } else if (
      request.type === RequestType.TASK_SCHEDULE_CREATION &&
      request.status === Status.PENDING
    ) {
      await this.taskScheduleService.createTaskSchedule(
        request.details as unknown as CreateTaskScheduleDto,
      );
      return this.requestsService.updateRequestStatus(
        parseInt(requestId),
        Status.VERIFIED,
      );
    }

    throw new Error('Request cannot be approved');
  }
  @Patch(':id/deny')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN])
  async denyTaskInstanceRequest(@Param('id') requestId: string) {
    const request = await this.requestsService.getRequestById(
      parseInt(requestId),
    );
    if (
      request.type === RequestType.TASK_INSTANCE_CREATION &&
      request.status === Status.PENDING
    ) {
      return this.requestsService.updateRequestStatus(
        parseInt(requestId),
        Status.VERIFIED,
      );
    } else if (
      request.type === RequestType.TASK_SCHEDULE_CREATION &&
      request.status === Status.PENDING
    ) {
      return this.requestsService.updateRequestStatus(
        parseInt(requestId),
        Status.CANCELLED,
      );
    }

    throw new Error('Request cannot be approved');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN, Role.EMPLOYEE])
  async getAllRequests(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'createdAt', 'status'])
    sortingParams: Sorting,
    @SearchDecorator('email') searchParams: ISearch,
    @Query('adminId') adminId: string,
  ) {
    return await this.requestsService.getAllRequests(
      adminId,
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
}
