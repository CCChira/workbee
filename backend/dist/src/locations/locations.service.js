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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const contracts_service_1 = require("../contracts/contracts.service");
let LocationsService = class LocationsService {
    constructor(prisma, contractsService) {
        this.prisma = prisma;
        this.contractsService = contractsService;
    }
    createLocation(location, contractId) {
        return this.prisma.location.create({
            data: {
                ...location,
                contractId,
            },
        });
    }
    createMultipleLocations(locations, contractId) {
        console.log(contractId);
        return this.prisma.location.createMany({
            data: locations.map((location) => ({
                ...location,
                contractId,
            })),
        });
    }
    updateLocation(id, location) {
        return this.prisma.location.update({
            where: { id },
            data: {
                ...location,
            },
        });
    }
    findLocation(id) {
        return this.prisma.location.findUnique({ where: { id } });
    }
    async findLocations(clientId, contractId, paginationParams, sortingParams, searchParams) {
        const actualContractId = parseInt(contractId ? contractId : '0');
        const { data } = await this.contractsService.getAllContractsByClientId(clientId, paginationParams);
        const contractIds = data.map((contract) => contract.id);
        const response = await this.prisma.location.findMany({
            skip: paginationParams.offset ?? 0,
            take: paginationParams.limit ?? 10,
            orderBy: [
                {
                    [sortingParams.property || 'id']: sortingParams.direction || 'desc',
                },
            ],
            where: searchParams.field && searchParams.searchParam
                ? {
                    contractId: actualContractId
                        ? actualContractId
                        : { in: contractIds },
                    [searchParams.field]: {
                        contains: searchParams.searchParam,
                        mode: 'insensitive',
                    },
                }
                : {
                    contractId: actualContractId
                        ? actualContractId
                        : { in: contractIds },
                },
        });
        return {
            data: response,
            dataSize: response.length,
            page: paginationParams.page,
            size: paginationParams.size,
        };
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        contracts_service_1.ContractsService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map