// src/task-template.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskTemplateDto } from './dto/createTaskTemplate.dto';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';

@Injectable()
export class TaskTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaskTemplate(dto: CreateTaskTemplateDto) {
    return this.prisma.taskTemplate.create({
      data: {
        title: dto.title,
        necessaryWorkers: dto.necessaryWorkers,
        necessaryTools: dto.necessaryTools,
        contractId: dto.contractId ?? null,
      },
    });
  }
  async createMultipleTaskTemplates(dto: CreateTaskTemplateDto[]) {
    const taskTemplatesData = dto.map((template) => ({
      title: template.title,
      necessaryWorkers: template.necessaryWorkers,
      necessaryTools: template.necessaryTools,
      contractId: template.contractId ?? null,
    }));

    return this.prisma.taskTemplate.createMany({
      data: taskTemplatesData,
      skipDuplicates: true, // Optional, to skip duplicates
    });
  }
  async findAllTaskTemplates(
    contractId: number,
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.taskTemplate.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'desc',
        },
      ],
      where: contractId
        ? search?.field && search?.searchParam
          ? {
              contractId: contractId,
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : { contractId: contractId }
        : search?.field && search?.searchParam
          ? {
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : {},
      select: {
        id: true,
        title: true,
        necessaryWorkers: true,
        necessaryTools: true,
        contractId: true,
        TaskSchedule: {
          select: {
            id: true,
            description: true,
            isActive: true,
            status: true,
          },
        },
        _count: {
          select: {
            TaskSchedule: true, // Count the number of schedules linked to this instance
          },
        },
      },
    });

    return {
      data: response,
      dataSize: response.length,
      page,
      size,
    };
  }

  findTaskTemplate(taskTemplateId: number) {
    return this.prisma.taskTemplate.findUnique({
      where: { id: taskTemplateId },
    });
  }

  async getTaskTemplatesCount() {
    const totalCount = await this.prisma.taskTemplate.count();
    const usedCount = await this.prisma.taskTemplate.count({
      where: {
        TaskSchedule: {
          some: {},
        },
      },
    });
    const instancesToday = await this.prisma.taskInstance.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const today = new Date();
    const nextWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
    );

    const instancesNext7Days = await this.prisma.taskInstance.count({
      where: {
        date: {
          gte: today,
          lt: nextWeek,
        },
      },
    });

    return {
      totalCount,
      usedCount,
      instancesToday,
      instancesNext7Days,
    };
  }
}
