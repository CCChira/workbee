import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { CreateTaskInstanceDto } from './dto/createTaskInstance.dto';

@Injectable()
export class TaskinstanceService {
  constructor(private readonly prismaService: PrismaService) {}
  createTaskInstance(taskInstanceDto: CreateTaskInstanceDto) {
    return this.prismaService.taskInstance.create({
      data: {
        status: taskInstanceDto.status,
        date: new Date(taskInstanceDto.date),
        hour: taskInstanceDto.hour,
        roomId: taskInstanceDto.roomId,
      },
    });
  }
  updateTaskInstance(instanceId: number, updateTaskInstanceDto: any) {
    return this.prismaService.taskInstance.update({
      where: { id: instanceId },
      data: updateTaskInstanceDto,
    });
  }
  deleteTaskInstance(instanceId: number) {
    return this.prismaService.taskInstance.delete({
      where: { id: instanceId },
    });
  }
  async getTaskInstance(instanceId: number) {
    return this.prismaService.taskInstance.findUnique({
      where: { id: instanceId },
    });
  }
  async getTaskInstancesByTaskScheduleId(taskScheduleId: number) {
    return this.prismaService.taskInstance.findMany({
      where: { taskScheduleId: taskScheduleId },
    });
  }
  async getTaskInstancesByDateInterval(startDate: string, endDate: string) {
    return this.prismaService.taskInstance.findMany({
      where: {
        AND: [
          { date: { gte: new Date(startDate) } },
          { date: { lte: new Date(endDate) } },
        ],
      },
    });
  }
  async getTasksAssignedToUser(userId: string) {
    return this.prismaService.taskInstance.findMany({
      where: {
        TaskAssignment: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        TaskAssignment: true,
        room: true,
        taskSchedule: true,
      },
    });
  }
  async getTasksAssignedToUserWithinInterval(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.prismaService.taskInstance.findMany({
      where: {
        AND: [
          {
            TaskAssignment: {
              some: {
                userId: userId,
              },
            },
          },
          {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        ],
      },
      include: {
        TaskAssignment: true,
        room: true,
        taskSchedule: true,
      },
    });
  }
  async getAllTaskInstances(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prismaService.taskInstance.findMany({
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
  async assignUserToTaskInstance(instanceId: number, userId: string) {
    return this.prismaService.taskAssignment.create({
      data: {
        taskId: instanceId,
        userId: userId,
      },
    });
  }
}
