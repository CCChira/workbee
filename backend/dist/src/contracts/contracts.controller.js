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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const contracts_service_1 = require("./contracts.service");
const contract = {
    id: 0,
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    clientId: '',
};
let ContractsController = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async getContracts(paginationParams, sortingParams, searchParam) {
        return this.contractsService.getAllContracts(paginationParams, sortingParams, searchParam);
    }
    async getContractsByClientId(paginationParams, sortingParams, searchParam, clientId) {
        return this.contractsService.getAllContractsByClientId(clientId, paginationParams, sortingParams, searchParam);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(Object.keys(contract).map((key) => `${key}`))),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContracts", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, SearchDecorator_decorator_1.SearchApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(1, (0, sortingParams_decorator_1.SortingParamsDecorator)(['title', 'id'])),
    __param(2, (0, SearchDecorator_decorator_1.SearchDecorator)('title')),
    __param(3, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContractsByClientId", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('contracts'),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map