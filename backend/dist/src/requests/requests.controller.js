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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const taskschedules_service_1 = require("../taskschedules/taskschedules.service");
const client_1 = require("@prisma/client");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const swagger_1 = require("@nestjs/swagger");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const taskinstance_service_1 = require("../taskinstance/taskinstance.service");
let RequestsController = class RequestsController {
    constructor(requestsService, taskScheduleService, taskInstanceService) {
        this.requestsService = requestsService;
        this.taskScheduleService = taskScheduleService;
        this.taskInstanceService = taskInstanceService;
    }
    async approveTaskInstanceRequest(requestId) {
        const request = await this.requestsService.getRequestById(parseInt(requestId));
        if (request.type === client_1.RequestType.TASK_INSTANCE_CREATION &&
            request.status === client_1.Status.PENDING) {
            await this.taskInstanceService.createTaskInstance(request.details);
            return this.requestsService.updateRequestStatus(parseInt(requestId), client_1.Status.VERIFIED);
        }
        else if (request.type === client_1.RequestType.TASK_SCHEDULE_CREATION &&
            request.status === client_1.Status.PENDING) {
            await this.taskScheduleService.createTaskSchedule(request.details);
            return this.requestsService.updateRequestStatus(parseInt(requestId), client_1.Status.VERIFIED);
        }
        throw new Error('Request cannot be approved');
    }
    async denyTaskInstanceRequest(requestId) {
        const request = await this.requestsService.getRequestById(parseInt(requestId));
        if (request.type === client_1.RequestType.TASK_INSTANCE_CREATION &&
            request.status === client_1.Status.PENDING) {
            return this.requestsService.updateRequestStatus(parseInt(requestId), client_1.Status.VERIFIED);
        }
        else if (request.type === client_1.RequestType.TASK_SCHEDULE_CREATION &&
            request.status === client_1.Status.PENDING) {
            return this.requestsService.updateRequestStatus(parseInt(requestId), client_1.Status.CANCELLED);
        }
        throw new Error('Request cannot be approved');
    }
    async getAllRequests(paginationParams, sortingParams, searchParams, adminId) {
        return await this.requestsService.getAllRequests(adminId, paginationParams, sortingParams, searchParams);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "approveTaskInstanceRequest", null);
__decorate([
    (0, common_1.Patch)(':id/taskinstance/deny'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "denyTaskInstanceRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.EMPLOYEE]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['id', 'createdAt', 'status'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('email')),
    __param(3, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAllRequests", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, swagger_1.ApiTags)('Requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        taskschedules_service_1.TaskSchedulesService,
        taskinstance_service_1.TaskinstanceService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map