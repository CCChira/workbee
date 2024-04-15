import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Pagination,
  PaginationParamsDecorator,
} from '../utils/decorator/paginationParams.decorator';
import {
  Sorting,
  SortingParamsDecorator,
} from '../utils/decorator/sortingParams.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Role } from '@prisma/client';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getUsers(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'role', 'email', 'name', 'createdAt'])
    sortingParams: Sorting,
  ) {
    return this.usersService.findAllUsers(paginationParams, sortingParams);
  }

  @Post('/generate')
  @HttpCode(HttpStatus.OK)
  public async generateUser(@Body() generateUserDto: any) {
    return this.usersService.create(generateUserDto);
  }
}
