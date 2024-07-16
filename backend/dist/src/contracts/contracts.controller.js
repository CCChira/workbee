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
const createContract_dto_1 = require("./dto/createContract.dto");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_service_1 = require("../services/aws-s3.service");
const swagger_1 = require("@nestjs/swagger");
const contract = {
    id: 0,
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    clientId: '',
    pdfUrl: '',
};
let ContractsController = class ContractsController {
    constructor(contractsService, awsS3Service) {
        this.contractsService = contractsService;
        this.awsS3Service = awsS3Service;
    }
    async getContracts(paginationParams, sortingParams, searchParam) {
        return this.contractsService.getAllContracts(paginationParams, sortingParams, searchParam);
    }
    async getTopContracts() {
        return this.contractsService.getTopContracts();
    }
    async getContractsByClientId(paginationParams, sortingParams, searchParam, clientId) {
        return this.contractsService.getAllContractsByClientId(clientId, paginationParams, sortingParams, searchParam);
    }
    async createContract(createContractDto, pdf, clientId) {
        const bucketName = 'workbee-files';
        const fileKey = `contracts/${Date.now()}-${'test'}`;
        let pdfUrl = '';
        if (pdf)
            pdfUrl = await this.awsS3Service.uploadFile(bucketName, fileKey, pdf.buffer);
        createContractDto.pdfUrl = pdfUrl ? pdfUrl : '';
        return this.contractsService.createContract(createContractDto, clientId);
    }
    async getContractById(id) {
        const contract = await this.contractsService.getContractById(id);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with ID ${id} not found`);
        }
        return contract;
    }
    async updateContract(id, updateData) {
        const updatedContract = await this.contractsService.updateContract(id, updateData);
        if (!updatedContract) {
            throw new common_1.NotFoundException(`Contract with ID ${id} not found`);
        }
        return updatedContract;
    }
    async deleteContract(id) {
        const deleted = await this.contractsService.deleteContract(parseInt(id));
        if (!deleted) {
            throw new common_1.NotFoundException(`Contract with ID ${id} not found`);
        }
        return deleted;
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
    (0, common_1.Get)('top5contracts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getTopContracts", null);
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
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('pdf')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                pdf: {
                    type: 'string',
                    format: 'binary',
                },
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                startDate: {
                    type: 'string',
                },
                endDate: {
                    type: 'string',
                },
            },
        },
    }),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createContract_dto_1.CreateContractDto, Object, String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "createContract", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getContractById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "deleteContract", null);
exports.ContractsController = ContractsController = __decorate([
    (0, swagger_1.ApiTags)('Contracts'),
    (0, common_1.Controller)('contracts'),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService,
        aws_s3_service_1.AwsS3Service])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map