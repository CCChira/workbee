// src/task-schedules/task-schedule.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTaskScheduleDto } from './dto/createTaskSchedule.dto';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Prisma, Role } from '@prisma/client';
import { TaskSchedulesService } from './taskschedules.service';
import { RequestsService } from '../requests/requests.service';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Controller('taskschedules')
@ApiTags('Task Schedules')
export class TaskSchedulesController {
  constructor(
    private readonly taskScheduleService: TaskSchedulesService,
    private readonly requestsService: RequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AuthDecorators([Role.CLIENT, Role.ADMIN])
  async createTaskSchedule(
    @Body() createTaskScheduleDto: CreateTaskScheduleDto,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
    return this.requestsService.createTaskScheduleRequest({
      details: createTaskScheduleDto as unknown as Prisma.JsonObject,
      createdById: createTaskScheduleDto.userId,
      addressedToId: user.id,
    });
  }
  @Post('/admin')
  @HttpCode(HttpStatus.CREATED)
  @AuthDecorators([Role.ADMIN])
  async createTaskScheduleAdmin(
    @Body() createTaskScheduleDto: CreateTaskScheduleDto,
  ) {
    return this.taskScheduleService.createTaskSchedule(createTaskScheduleDto);
  }
}
