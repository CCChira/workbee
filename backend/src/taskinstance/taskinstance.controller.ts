import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskinstanceService } from './taskinstance.service';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Prisma, Role } from '@prisma/client';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import {
  ISearch,
  SearchApiQuery,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';
import {
  Pagination,
  PaginationParamsDecorator,
} from '../utils/decorator/paginationParams.decorator';
import {
  Sorting,
  SortingParamsDecorator,
} from '../utils/decorator/sortingParams.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RequestsService } from '../requests/requests.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Task Instances')
@Controller('taskinstance')
export class TaskinstanceController {
  constructor(
    private readonly taskInstanceService: TaskinstanceService,
    private readonly requestService: RequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @AuthDecorators([Role.ADMIN])
  async createTaskInstance(
    @Body() createTaskInstanceDto: CreateTaskInstanceDto,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
    return this.requestService.createTaskInstanceRequest({
      details: createTaskInstanceDto as unknown as Prisma.JsonObject,
      createdById: createTaskInstanceDto.userId,
      addressedToId: user.id,
    });
  }

  @Patch(':id')
  @AuthDecorators([Role.ADMIN])
  async updateTaskInstance(
    @Param('id') instanceId: string,
    @Body() updateTaskInstanceDto: CreateTaskInstanceDto,
  ) {
    return this.taskInstanceService.updateTaskInstance(
      parseInt(instanceId),
      updateTaskInstanceDto,
    );
  }

  @Delete(':id')
  @AuthDecorators([Role.ADMIN])
  async deleteTaskInstance(@Param('id') instanceId: string) {
    return this.taskInstanceService.deleteTaskInstance(parseInt(instanceId));
  }

  @Get(':id')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstance(@Param('id') instanceId: string) {
    return this.taskInstanceService.getTaskInstance(parseInt(instanceId));
  }

  @Get('by-schedule/:scheduleId')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstancesByTaskScheduleId(
    @Param('scheduleId') taskScheduleId: string,
  ) {
    return this.taskInstanceService.getTaskInstancesByTaskScheduleId(
      parseInt(taskScheduleId),
    );
  }

  @Get('by-date')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstancesByDateInterval(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.taskInstanceService.getTaskInstancesByDateInterval(
      startDate,
      endDate,
    );
  }

  @Get('assigned-to-user/:userId')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTasksAssignedToUser(@Param('userId') userId: string) {
    return this.taskInstanceService.getTasksAssignedToUser(userId);
  }

  @Get('assigned-to-user-dates')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTasksAssignedToUserWithinInterval(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.taskInstanceService.getTasksAssignedToUserWithinInterval(
      userId,
      startDate,
      endDate,
    );
  }

  @Get('all')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  @PagSortApiQuery()
  @SearchApiQuery()
  async getAllTaskInstances(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'date', 'status', 'roomId'])
    sortingParams: Sorting,
    @SearchDecorator('status') searchParam: ISearch,
  ) {
    return this.taskInstanceService.getAllTaskInstances(
      paginationParams,
      sortingParams,
      searchParam,
    );
  }

  @Post('assign-user')
  @AuthDecorators([Role.ADMIN])
  async assignUserToTaskInstance(
    @Query('instanceId') instanceId: string,
    @Query('userId') userId: string,
  ) {
    return this.taskInstanceService.assignUserToTaskInstance(
      parseInt(instanceId),
      userId,
    );
  }
}
