import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ROUNDS_OF_HASHING } from '../auth/constants/auth.constants';
import { Role } from '@prisma/client';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { TwilioService } from '../services/twilio.service';
import { startOfWeek } from 'date-fns';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private twilio: TwilioService,
  ) {}

  async getTaskCountsByStatusForEmployees() {
    const employees = await this.prisma.user.findMany({
      include: {
        TaskAssignment: {
          include: {
            task: true, // Assuming task points to TaskInstance
          },
        },
      },
      where: {
        TaskAssignment: {
          some: {
            task: {
              date: {
                gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
              },
            },
          },
        },
      },
    });

    return employees.map((employee) => ({
      employeeId: employee.id,
      name: employee.name || 'No Name Provided',
      taskCounts: employee.TaskAssignment.reduce((acc, assignment) => {
        const status = assignment.task.status || 'Undefined';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
    }));
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      ROUNDS_OF_HASHING,
    );

    return this.prisma.user.create({
      data: createUserDto,
    });
  }
  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async generateInviteCode(inviteUserDto: InviteUserDto) {
    const { id } = await this.prisma.user.create({
      data: inviteUserDto.email
        ? {
            name: inviteUserDto.name,
            email: inviteUserDto.email,
            role: inviteUserDto.role,
            password: 'mockPass',
          }
        : {
            name: inviteUserDto.name,
            phoneNumber: inviteUserDto.phoneNumber,
            role: inviteUserDto.role,
            password: 'mockPass',
          },
    });
    if (inviteUserDto.phoneNumber)
      await this.twilio.sendInviteCodeSMS(inviteUserDto.phoneNumber, id);
    else {
    }
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
  userExists(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAllUserByRole(role: string) {
    const roleEnumValue = Role[role.toUpperCase() as keyof typeof Role];

    if (!roleEnumValue) throw new Error(`Invalid role: ${role.toUpperCase()}`);

    return this.prisma.user.findMany({ where: { role: roleEnumValue } });
  }
  findUser(id: string) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }
  async findAllUsers(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'asc',
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
  async findAllClients(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'asc',
        },
      ],
      where:
        search.field && search.searchParam
          ? {
              role: Role.CLIENT,
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : { role: Role.CLIENT },
    });

    return {
      data: response,
      dataSize: response.length,
      page,
      size,
    };
  }
  async getTopUsersByCompletedTasks() {
    const users = await this.prisma.user.findMany({
      include: {
        TaskAssignment: {
          include: {
            task: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const processedUsers = users.map((user) => ({
      ...user,
      completedTaskCount: user.TaskAssignment.reduce((acc, assignment) => {
        return acc + (assignment.task.status === 'COMPLETED' ? 1 : 0);
      }, 0),
    }));

    processedUsers.sort((a, b) => b.completedTaskCount - a.completedTaskCount);

    return processedUsers.slice(0, 10);
  }
  async findAllEmployees(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
    search?: ISearch,
  ) {
    const response = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: [
        {
          [sort?.property || 'id']: sort?.direction || 'asc',
        },
      ],
      where:
        search.field && search.searchParam
          ? {
              role: Role.EMPLOYEE,
              [search.field]: {
                contains: search.searchParam,
                mode: 'insensitive',
              },
            }
          : { role: Role.EMPLOYEE },
      include: {
        _count: {
          select: {
            TaskAssignment: true,
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

  async deleteMultiple(deleteMultipleUsersDto: DeleteMultipleUsersDto) {
    return this.prisma.user.deleteMany({
      where: {
        id: {
          in: deleteMultipleUsersDto.users,
        },
      },
    });
  }

  async createUser(createUser: CreateUserDto) {
    const info = await this.prisma.inviteCodes.findUnique({
      where: { id: createUser.inviteCode },
    });
    return this.prisma.user.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        password: createUser.password,
        role: info.role,
      },
    });
  }

  async getEmployeeDetails(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        TaskAssignment: {
          include: {
            task: {
              select: {
                id: true,
                _count: true,
              },
            },
          },
        },
      },
    });
  }

  async employeeLogin(payload: { token: string }) {
    const { token } = payload;
    console.log(token);
    const response = await this.prisma.user.findUnique({
      where: { id: token },
    });
    console.log(response);
    return response;
  }

  getUserChat(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
