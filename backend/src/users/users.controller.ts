import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { Role } from '@prisma/client';
import { PagSortApiQuery } from '../utils/decorator/PagSortApiQuery.decorator';
import {
  ISearch,
  SearchApiQuery,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';
import { DeleteMultipleUsersDto } from './dto/deleteMultipleUsers.dto';
import { DummyProvider } from '../providers/SMSProvider/dummyProvider.service';
import { InviteUserDto } from './dto/inviteUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@ApiBearerAuth()
@ApiTags('Users')
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
  @Get('clients')
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getClients(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'role', 'email', 'name', 'createdAt'])
    sortingParams: Sorting,
    @SearchDecorator('email') searchParams: ISearch,
  ) {
    return this.usersService.findAllClients(
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
  @Get('employees')
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @SearchApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getEmployees(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['id', 'role', 'email', 'name', 'createdAt'])
    sortingParams: Sorting,
    @SearchDecorator('name') searchParams: ISearch,
  ) {
    return this.usersService.findAllEmployees(
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
  @Get('employee/:employeeId')
  @HttpCode(HttpStatus.OK)
  @AuthDecorators([Role.ADMIN])
  public async getEmployeeDetails(@Param() { id }: { id: string }) {
    return this.usersService.getEmployeeDetails(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PagSortApiQuery()
  @AuthDecorators([Role.ADMIN])
  public async getUser(@Param() { id }: { id: string }) {
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
  public async generateUser(@Body() inviteUserDto: InviteUserDto) {
    if (!inviteUserDto.phoneNumber && !inviteUserDto.email) {
      throw new HttpException('Phone number or email is required', 400);
    }

    await this.smsProvider.sendSmsCode(inviteUserDto.email, inviteUserDto.role);
    return await this.usersService.generateInviteCode(inviteUserDto);
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  public async createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.createUser(createUser);
  }

  @Post('/delete-multiple')
  @HttpCode(HttpStatus.OK)
  public async patchUsers(
    @Body() deleteMultipleUsersDto: DeleteMultipleUsersDto,
  ) {
    return this.usersService.deleteMultiple(deleteMultipleUsersDto);
  }
}
