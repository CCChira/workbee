import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN])
  @PagSortApiQuery()
  public async getUsers(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['role']) sortingParams: Sorting,
  ) {
    this.logger.log('Get all users');
    return this.usersService.findAllUsers(paginationParams, sortingParams);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generateUser(@Body() generateUserDto: any) {
    return this.usersService.create(generateUserDto);
  }
}
