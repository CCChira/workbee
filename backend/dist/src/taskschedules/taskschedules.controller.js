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
exports.TaskSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const createTaskSchedule_dto_1 = require("./dto/createTaskSchedule.dto");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const taskschedules_service_1 = require("./taskschedules.service");
const requests_service_1 = require("../requests/requests.service");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
let TaskSchedulesController = class TaskSchedulesController {
    constructor(taskScheduleService, requestsService, prisma) {
        this.taskScheduleService = taskScheduleService;
        this.requestsService = requestsService;
        this.prisma = prisma;
    }
    async createTaskSchedule(createTaskScheduleDto) {
        const user = await this.prisma.user.findFirst({
            where: { role: client_1.Role.ADMIN },
        });
        return this.requestsService.createTaskScheduleRequest({
            details: createTaskScheduleDto,
            createdById: createTaskScheduleDto.userId,
            addressedToId: user.id,
        });
    }
    async createTaskScheduleAdmin(createTaskScheduleDto) {
        return this.taskScheduleService.createTaskSchedule(createTaskScheduleDto);
    }
};
exports.TaskSchedulesController = TaskSchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.CLIENT, client_1.Role.ADMIN]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskSchedule_dto_1.CreateTaskScheduleDto]),
    __metadata("design:returntype", Promise)
], TaskSchedulesController.prototype, "createTaskSchedule", null);
__decorate([
    (0, common_1.Post)('/admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskSchedule_dto_1.CreateTaskScheduleDto]),
    __metadata("design:returntype", Promise)
], TaskSchedulesController.prototype, "createTaskScheduleAdmin", null);
exports.TaskSchedulesController = TaskSchedulesController = __decorate([
    (0, common_1.Controller)('taskschedules'),
    (0, swagger_1.ApiTags)('Task Schedules'),
    __metadata("design:paramtypes", [taskschedules_service_1.TaskSchedulesService,
        requests_service_1.RequestsService,
        prisma_service_1.PrismaService])
], TaskSchedulesController);
//# sourceMappingURL=taskschedules.controller.js.map