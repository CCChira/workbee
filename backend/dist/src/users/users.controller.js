"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const swagger_1 = require("@nestjs/swagger");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const deleteMultipleUsers_dto_1 = require("./dto/deleteMultipleUsers.dto");
const dummyProvider_service_1 = require("../providers/SMSProvider/dummyProvider.service");
const inviteUser_dto_1 = require("./dto/inviteUser.dto");
const createUser_dto_1 = require("./dto/createUser.dto");
const updateUser_dto_1 = require("./dto/updateUser.dto");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService, smsProvider) {
        this.usersService = usersService;
        this.smsProvider = smsProvider;
        this.logger = new common_1.Logger(UsersController_1.name);
    }
    async getUsers(paginationParams, sortingParams, searchParams) {
        return this.usersService.findAllUsers(paginationParams, sortingParams, searchParams);
    }
    async topEmployees() {
        return this.usersService.getTopUsersByCompletedTasks();
    }
    async getUtilEmployee() {
        return this.usersService.getTaskCountsByStatusForEmployees();
    }
    async getClients(paginationParams, sortingParams, searchParams) {
        return this.usersService.findAllClients(paginationParams, sortingParams, searchParams);
    }
    async getUserChat(userId) {
        return this.usersService.getUserChat(userId);
    }
    async getEmployees(paginationParams, sortingParams, searchParams) {
        return this.usersService.findAllEmployees(paginationParams, sortingParams, searchParams);
    }
    async getEmployeeDetails({ id }) {
        return this.usersService.getEmployeeDetails(id);
    }
    async getUser({ id }) {
        return this.usersService.findUser(id);
    }
    async deleteUser(userId) {
        return this.usersService.deleteUser(userId);
    }
    async updateUser(id, updateUserDto) {
        return this.usersService.updateUser(id, updateUserDto);
    }
    async generateUser(inviteUserDto) {
        if (!inviteUserDto.phoneNumber && !inviteUserDto.email) {
            throw new common_1.HttpException('Phone number or email is required', 400);
        }
        await this.smsProvider.sendSmsCode(inviteUserDto.email, inviteUserDto.role);
        return await this.usersService.generateInviteCode(inviteUserDto);
    }
    async validateLogin(token) {
        return await this.usersService.employeeLogin(token);
    }
    async createUser(createUser) {
        return this.usersService.createUser(createUser);
    }
    async patchUsers(deleteMultipleUsersDto) {
        return this.usersService.deleteMultiple(deleteMultipleUsersDto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'role', 'email', 'name', 'createdAt'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('topEmployees'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "topEmployees", null);
__decorate([
    (0, common_1.Get)('employeeUtil'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUtilEmployee", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'role', 'email', 'name', 'createdAt'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)('getUserChat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('userChatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserChat", null);
__decorate([
    (0, common_1.Get)('employees'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'role', 'email', 'name', 'createdAt'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmployeeDetails", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateUser_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inviteUser_dto_1.InviteUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "generateUser", null);
__decorate([
    (0, common_1.Post)('employee-login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "validateLogin", null);
__decorate([
    (0, common_1.Post)('/verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/delete-multiple'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deleteMultipleUsers_dto_1.DeleteMultipleUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUsers", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        dummyProvider_service_1.DummyProvider])
], UsersController);
//# sourceMappingURL=users.controller.js.map