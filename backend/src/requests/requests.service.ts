import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RequestType, Status } from '@prisma/client';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { UpdateTaskInstanceDto } from './dto/taskInstance.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(data: {
    type: RequestType;
    details: Prisma.JsonValue;
    createdById: string;
    addressedToId: string;
  }) {
    return this.prisma.request.create({
      data: {
        type: data.type,
        details: data.details,
        createdById: data.createdById,
        assignedToId: data.addressedToId,
        status: Status.PENDING,
      },
    });
  }
  async createTaskScheduleRequest(data: {
    details: Prisma.JsonObject;
    createdById: string;
    addressedToId: string;
  }) {
    return this.prisma.request.create({
      data: {
        type: RequestType.TASK_SCHEDULE_CREATION,
        details: data.details,
        createdById: data.createdById,
        assignedToId: data.addressedToId,
        status: Status.PENDING,
      },
    });
  }
  async getRequestById(id: number) {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }
  async updateRequestStatus(id: number, status: Status) {
    return this.prisma.request.update({
      where: { id },
      data: { status },
    });
  }
  async getAllRequests(
    adminId: string,
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.request.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'createdAt']: sort?.direction || 'asc',
        },
      ],
      where:
        search.field && search.searchParam
          ? {
              assignedToId: adminId,
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : { assignedToId: adminId },
    });
    const promises = response.map(async (res) => {
      return {
        ...res,
        createdBy: await this.prisma.user.findUnique({
          where: { id: res.createdById },
        }),
      };
    });
    const toSend = await Promise.all(promises);

    return {
      data: toSend,
      dataSize: toSend.length,
      page,
      size,
    };
  }
  async createTaskInstanceRequest(data: {
    details: Prisma.JsonObject;
    createdById: string;
    addressedToId: string;
  }) {
    return this.prisma.request.create({
      data: {
        type: RequestType.TASK_INSTANCE_CREATION,
        details: data.details,
        createdById: data.createdById,
        assignedToId: data.addressedToId,
        status: Status.PENDING,
      },
    });
  }

  async updateTaskInstanceRequest(
    id: number,
    data: UpdateTaskInstanceDto,
    createdById: string,
  ) {
    return this.prisma.request.create({
      data: {
        type: RequestType.TASK_INSTANCE_UPDATE,
        details: data as unknown as Prisma.JsonObject,
        createdById: createdById,
        assignedToId: createdById, // Assuming self-assignment for simplicity
        status: Status.PENDING,
      },
    });
  }
}
