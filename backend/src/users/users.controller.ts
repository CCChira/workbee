import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
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
import {
  ISearch,
  SearchApiQuery,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly smsProvider: DummyProvider,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getUsers(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'role', 'email', 'name', 'createdAt'])
    sortingParams: Sorting,
    @SearchDecorator('email') searchParams: ISearch,
  ) {
    return this.usersService.findAllUsers(
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getUser(@Param() { id }: { id: string }) {
    console.log(id);
    return this.usersService.findUser(id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN])
  public async deleteUser(@Body() userId: string) {
    return this.usersService.deleteUser(userId);
  }
  @Post('')
  @HttpCode(HttpStatus.OK)
  public async generateUser(@Body() generateUserDto: CreateUserDto) {
    await this.smsProvider.sendSmsCode(
      generateUserDto.email,
      generateUserDto.role,
    );
    return await this.usersService.generateInviteCode(generateUserDto);
  }
  @Post('/delete-multiple')
  @HttpCode(HttpStatus.OK)
  public async patchUsers(
    @Body() deleteMultipleUsersDto: DeleteMultipleUsersDto,
  ) {
    return this.usersService.deleteMultiple(deleteMultipleUsersDto);
  }
}
