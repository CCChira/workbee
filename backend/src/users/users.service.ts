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

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private twilio: TwilioService,
  ) {}

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
    const { id } = await this.prisma.inviteCodes.create({
      data: inviteUserDto.email
        ? { email: inviteUserDto.email, role: inviteUserDto.role }
        : { phoneNumber: inviteUserDto.phoneNumber, role: inviteUserDto.role },
    });
    console.log(inviteUserDto.phoneNumber, id);
    if (inviteUserDto.phoneNumber)
      await this.twilio.sendInviteCodeSMS(inviteUserDto.phoneNumber, id);
    else {
      // send email
    }
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
}
