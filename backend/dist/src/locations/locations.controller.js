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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const PagSortApiQuery_decorator_1 = require("../utils/decorator/PagSortApiQuery.decorator");
const AuthDecorators_decorator_1 = require("../utils/decorator/AuthDecorators.decorator");
const client_1 = require("@prisma/client");
const locations_service_1 = require("./locations.service");
const paginationParams_decorator_1 = require("../utils/decorator/paginationParams.decorator");
const sortingParams_decorator_1 = require("../utils/decorator/sortingParams.decorator");
const SearchDecorator_decorator_1 = require("../utils/decorator/SearchDecorator.decorator");
const createLocation_dto_1 = require("./dto/createLocation.dto");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async getLocation({ id }) {
        console.log(id);
        return this.locationsService.findLocation(id);
    }
    async getLocations(clientId, contractId, paginationParams, sortingParams, searchParams) {
        return this.locationsService.findLocations(clientId, contractId, paginationParams, sortingParams, searchParams);
    }
    async createLocation(locationDto) {
        return this.locationsService.createLocation(locationDto);
    }
    async updateLocation(id, locationDto) {
        return this.locationsService.updateLocation(id, locationDto);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocation", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, PagSortApiQuery_decorator_1.PagSortApiQuery)(),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('contractId')),
    __param(2, (0, paginationParams_decorator_1.PaginationParamsDecorator)()),
    __param(3, (0, sortingParams_decorator_1.SortingParamsDecorator)(['name'])),
    __param(4, (0, SearchDecorator_decorator_1.SearchDecorator)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createLocation_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, AuthDecorators_decorator_1.AuthDecorators)([client_1.Role.ADMIN, client_1.Role.CLIENT]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createLocation_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "updateLocation", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map