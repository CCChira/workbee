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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskinstanceController = void 0;
const common_1 = require("@nestjs/common");
const taskinstance_service_1 = require("./taskinstance.service");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const createTaskInstance_dto_1 = require("./dto/createTaskInstance.dto");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const swagger_1 = require("@nestjs/swagger");
const requests_service_1 = require("../requests/requests.service");
const prisma_service_1 = require("../prisma/prisma.service");
const updateTaskInstanceStatus_dto_1 = require("./dto/updateTaskInstanceStatus.dto");
let TaskinstanceController = class TaskinstanceController {
    constructor(taskInstanceService, requestService, prisma) {
        this.taskInstanceService = taskInstanceService;
        this.requestService = requestService;
        this.prisma = prisma;
    }
    async createTaskInstance(createTaskInstanceDto) {
        const user = await this.prisma.user.findFirst({
            where: { role: client_1.Role.ADMIN },
        });
        return this.requestService.createTaskInstanceRequest({
            details: createTaskInstanceDto,
            createdById: createTaskInstanceDto.userId,
            addressedToId: user.id,
        });
    }
    async createSingularTaskInstance(createTaskInstanceDto) {
        return this.taskInstanceService.createTaskInstance(createTaskInstanceDto);
    }
    async updateTaskInstance(instanceId, updateTaskInstanceDto) {
        return this.taskInstanceService.updateTaskInstance(parseInt(instanceId), updateTaskInstanceDto);
    }
    async removeUserFromTaskInstance(userId, taskId) {
        return this.taskInstanceService.deleteUserFromTaskInstance(parseInt(taskId), userId);
    }
    async deleteTaskInstance(instanceId) {
        return this.taskInstanceService.deleteTaskInstance(parseInt(instanceId));
    }
    async getUnderstaffedTasks() {
        return this.taskInstanceService.getUnderstaffedTaskInstances();
    }
    async fetchTaskLoadAndEfficiency() {
        return this.taskInstanceService.fetchTaskLoadAndEfficiency();
    }
    async getTaskInstancesToday(userId) {
        console.log(userId);
        return this.taskInstanceService.findTasksForToday(userId);
    }
    async getStatusCounts(start, end) {
        return this.taskInstanceService.getTaskStatusCounts({
            start: start,
            end: end,
        });
    }
    async getTaskInstancesThisMonth() {
        return this.taskInstanceService.getTaskInstancesThisMonth();
    }
    async updateTaskInstanceStatus(id, updateTaskInstanceStatusDto) {
        return this.taskInstanceService.updateTaskInstanceStatus(parseInt(id), updateTaskInstanceStatusDto);
    }
    async getTaskInstancesByTaskScheduleId(taskScheduleId) {
        return this.taskInstanceService.getTaskInstancesByTaskScheduleId(parseInt(taskScheduleId));
    }
    async getTaskInstancesByDateState(month, year, contractId, roomId, locationId, userId, includeWorkers) {
        return this.taskInstanceService.getTaskInstancesByDateState(month, year, contractId, roomId, userId, !!includeWorkers, locationId);
    }
    async getTaskInstancesByRoomId(roomId, paginationParams, sortingParams) {
        return this.taskInstanceService.getTaskInstancesByRoomId(roomId, paginationParams, sortingParams);
    }
    async getTaskInstancesByDateInterval(startDate, endDate, contractId, roomId, locationId) {
        return this.taskInstanceService.getTaskInstancesByDateInterval(startDate, endDate, contractId, roomId, locationId);
    }
    async getTasksAssignedToUser(userId) {
        return this.taskInstanceService.getTasksAssignedToUser(userId);
    }
    async getTasksAssignedToUserWithinInterval(userId, startDate, endDate) {
        console.log('here');
        return this.taskInstanceService.getTasksAssignedToUserWithinInterval(userId, startDate, endDate);
    }
    async getTasksAssignedToUserThisWeek(userId) {
        return this.taskInstanceService.getTasksAssignedToUserThisWeek(userId);
    }
    async getAllTaskInstances(paginationParams, sortingParams, searchParam) {
        return this.taskInstanceService.getAllTaskInstances(paginationParams, sortingParams, searchParam);
    }
    async getTaskInstance(instanceId) {
        return this.taskInstanceService.getTaskInstance(parseInt(instanceId));
    }
    async assignUserToTaskInstance(instanceId, userId) {
        return this.taskInstanceService.assignUserToTaskInstance(parseInt(instanceId), userId);
    }
};
exports.TaskinstanceController = TaskinstanceController;
__decorate([
    (0, common_1.Post)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskInstance_dto_1.CreateTaskInstanceDto]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "createTaskInstance", null);
__decorate([
    (0, common_1.Post)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskInstance_dto_1.CreateTaskInstanceDto]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "createSingularTaskInstance", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, createTaskInstance_dto_1.CreateTaskInstanceDto]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "updateTaskInstance", null);
__decorate([
    (0, common_1.Delete)('/removeByUserTask'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "removeUserFromTaskInstance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "deleteTaskInstance", null);
__decorate([
    (0, common_1.Get)('underStaffed'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getUnderstaffedTasks", null);
__decorate([
    (0, common_1.Get)('taskEfficiency'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "fetchTaskLoadAndEfficiency", null);
__decorate([
    (0, common_1.Get)('instancesToday/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesToday", null);
__decorate([
    (0, common_1.Get)('statuscount'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getStatusCounts", null);
__decorate([
    (0, common_1.Get)('this-month'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesThisMonth", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateTaskInstanceStatus_dto_1.UpdateTaskInstanceStatusDto]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "updateTaskInstanceStatus", null);
__decorate([
    (0, common_1.Get)('by-schedule/:scheduleId'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesByTaskScheduleId", null);
__decorate([
    (0, common_1.Get)('by-date-state'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('contractId')),
    __param(3, (0, common_1.Query)('roomId')),
    __param(4, (0, common_1.Query)('locationId')),
    __param(5, (0, common_1.Query)('userId')),
    __param(6, (0, common_1.Query)('includeWorkers')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesByDateState", null);
__decorate([
    (0, common_1.Get)('room/:roomId'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(2, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'date', 'status', 'roomId'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesByRoomId", null);
__decorate([
    (0, common_1.Get)('by-date'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('contractId')),
    __param(3, (0, common_1.Query)('roomId')),
    __param(4, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstancesByDateInterval", null);
__decorate([
    (0, common_1.Get)('assigned-to-user/:userId'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTasksAssignedToUser", null);
__decorate([
    (0, common_1.Get)('assigned-to-user-dates/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTasksAssignedToUserWithinInterval", null);
__decorate([
    (0, common_1.Get)('assigned-to-user-week/:userId'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTasksAssignedToUserThisWeek", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'date', 'status', 'roomId'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getAllTaskInstances", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "getTaskInstance", null);
__decorate([
    (0, common_1.Post)('assign-user'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Query)('instanceId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaskinstanceController.prototype, "assignUserToTaskInstance", null);
exports.TaskinstanceController = TaskinstanceController = __decorate([
    (0, swagger_1.ApiTags)('Task Instances'),
    (0, common_1.Controller)('taskinstance'),
    __metadata("design:paramtypes", [taskinstance_service_1.TaskinstanceService,
        requests_service_1.RequestsService,
        prisma_service_1.PrismaService])
], TaskinstanceController);
//# sourceMappingURL=taskinstance.controller.js.map