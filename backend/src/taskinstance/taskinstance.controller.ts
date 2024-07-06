import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { UpdateTaskInstanceStatusDto } from './dto/updateTaskInstanceStatus.dto';

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

  @Post()
  @AuthDecorators([Role.ADMIN])
  async createSingularTaskInstance(
    @Body() createTaskInstanceDto: CreateTaskInstanceDto,
  ) {
    return this.taskInstanceService.createTaskInstance(createTaskInstanceDto);
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
  @Delete('/removeByUserTask')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async removeUserFromTaskInstance(
    @Query('userId') userId: string,
    @Query('taskId') taskId: string,
  ) {
    return this.taskInstanceService.deleteUserFromTaskInstance(
      parseInt(taskId),
      userId,
    );
  }
  @Delete(':id')
  @AuthDecorators([Role.ADMIN])
  async deleteTaskInstance(@Param('id') instanceId: string) {
    return this.taskInstanceService.deleteTaskInstance(parseInt(instanceId));
  }
  @Get('underStaffed')
  @HttpCode(HttpStatus.OK)
  async getUnderstaffedTasks() {
    return this.taskInstanceService.getUnderstaffedTaskInstances();
  }
  @Get('taskEfficiency')
  @HttpCode(HttpStatus.OK)
  async fetchTaskLoadAndEfficiency() {
    return this.taskInstanceService.fetchTaskLoadAndEfficiency();
  }
  @Get('statuscount')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getStatusCounts(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
  ) {
    return this.taskInstanceService.getTaskStatusCounts({
      start: start,
      end: end,
    });
  }
  @Get('this-month')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstancesThisMonth() {
    return this.taskInstanceService.getTaskInstancesThisMonth();
  }
  @Patch(':id/status')
  async updateTaskInstanceStatus(
    @Param('id') id: string,
    @Body() updateTaskInstanceStatusDto: UpdateTaskInstanceStatusDto,
  ) {
    return this.taskInstanceService.updateTaskInstanceStatus(
      parseInt(id),
      updateTaskInstanceStatusDto,
    );
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
  @Get('by-date-state')
  async getTaskInstancesByDateState(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('contractId') contractId: string,
    @Query('roomId') roomId: string,
    @Query('locationId') locationId: string,
    @Query('userId') userId: string,
    @Query('includeWorkers') includeWorkers: string,
  ) {
    return this.taskInstanceService.getTaskInstancesByDateState(
      month,
      year,
      contractId,
      roomId,
      userId,
      !!includeWorkers,
      locationId,
    );
  }
  @Get('room/:roomId')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  @PagSortApiQuery()
  async getTaskInstancesByRoomId(
    @Param('roomId') roomId: string,
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'date', 'status', 'roomId'])
    sortingParams: Sorting,
  ) {
    return this.taskInstanceService.getTaskInstancesByRoomId(
      roomId,
      paginationParams,
      sortingParams,
    );
  }
  @Get('by-date')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstancesByDateInterval(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('contractId') contractId: string,
    @Query('roomId') roomId: string,
    @Query('locationId') locationId: string,
  ) {
    return this.taskInstanceService.getTaskInstancesByDateInterval(
      startDate,
      endDate,
      contractId,
      roomId,
      locationId,
    );
  }

  @Get('assigned-to-user/:userId')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTasksAssignedToUser(@Param('userId') userId: string) {
    return this.taskInstanceService.getTasksAssignedToUser(userId);
  }

  @Get('assigned-to-user-dates/:userId')
  async getTasksAssignedToUserWithinInterval(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    console.log('here');
    return this.taskInstanceService.getTasksAssignedToUserWithinInterval(
      userId,
      startDate,
      endDate,
    );
  }
  @Get('assigned-to-user-week/:userId')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTasksAssignedToUserThisWeek(@Param('userId') userId: string) {
    return this.taskInstanceService.getTasksAssignedToUserThisWeek(userId);
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
  @Get(':id')
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async getTaskInstance(@Param('id') instanceId: string) {
    return this.taskInstanceService.getTaskInstance(parseInt(instanceId));
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
