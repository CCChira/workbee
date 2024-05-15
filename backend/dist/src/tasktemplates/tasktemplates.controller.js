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
exports.TaskTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const createTaskTemplate_dto_1 = require("./dto/createTaskTemplate.dto");
const tasktemplates_service_1 = require("./tasktemplates.service");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const taskTemplate = {
    id: 0,
    title: '',
    necessaryWorkers: 0,
    necessaryTools: [],
    contractId: 0,
};
let TaskTemplatesController = class TaskTemplatesController {
    constructor(taskTemplateService) {
        this.taskTemplateService = taskTemplateService;
    }
    async createTaskTemplate(dto) {
        return this.taskTemplateService.createTaskTemplate(dto);
    }
    async createMultipleTaskTemplates(dto) {
        return this.taskTemplateService.createMultipleTaskTemplates(dto);
    }
    async getTaskTemplatesCount() {
        return this.taskTemplateService.getTaskTemplatesCount();
    }
    async getTaskTemplate({ id }) {
        console.log(id);
        return this.taskTemplateService.findTaskTemplate(parseInt(id));
    }
    async getTaskTemplates(paginationParams, sortingParams, searchParam, contractId) {
        return this.taskTemplateService.findAllTaskTemplates(parseInt(contractId), paginationParams, sortingParams, searchParam);
    }
};
exports.TaskTemplatesController = TaskTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskTemplate_dto_1.CreateTaskTemplateDto]),
    __metadata("design:returntype", Promise)
], TaskTemplatesController.prototype, "createTaskTemplate", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TaskTemplatesController.prototype, "createMultipleTaskTemplates", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskTemplatesController.prototype, "getTaskTemplatesCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskTemplatesController.prototype, "getTaskTemplate", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(Object.keys(taskTemplate).map((key) => `${key}`))),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('title')),
    __param(3, (0, common_1.Query)('contractId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TaskTemplatesController.prototype, "getTaskTemplates", null);
exports.TaskTemplatesController = TaskTemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Task Templates'),
    (0, common_1.Controller)('task-templates'),
    __metadata("design:paramtypes", [tasktemplates_service_1.TaskTemplatesService])
], TaskTemplatesController);
//# sourceMappingURL=tasktemplates.controller.js.map