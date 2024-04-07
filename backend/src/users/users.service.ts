import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ROUNDS_OF_HASHING } from '../auth/constants/auth.constants';
import { Role } from '@prisma/client';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { CreateUserDto } from './dto/user.dto';
import { GenerateUserDto } from './dto/generateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      ROUNDS_OF_HASHING,
    );

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async generateUser(generateUserDto: GenerateUserDto) {
    const creationResponse = await this.prisma.inviteCodes.create({
      data: generateUserDto,
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
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findAllUsers(
    { page, limit, offset, size }: Pagination,
    sort?: Sorting,
  ) {
    const response = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [sort?.property || 'id']: sort?.direction || 'asc',
      },
    });
    return {
      data: response,
      dataSize: response.length,
      page,
      size,
    };
  }
}
