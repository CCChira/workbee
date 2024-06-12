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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RequestsService = class RequestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRequest(data) {
        return this.prisma.request.create({
            data: {
                type: data.type,
                details: data.details,
                createdById: data.createdById,
                assignedToId: data.addressedToId,
                status: client_1.Status.PENDING,
            },
        });
    }
    async createTaskScheduleRequest(data) {
        return this.prisma.request.create({
            data: {
                type: client_1.RequestType.TASK_SCHEDULE_CREATION,
                details: data.details,
                createdById: data.createdById,
                assignedToId: data.addressedToId,
                status: client_1.Status.PENDING,
            },
        });
    }
    async getRequestById(id) {
        const request = await this.prisma.request.findUnique({
            where: { id },
        });
        if (!request) {
            throw new common_1.NotFoundException(`Request with ID ${id} not found`);
        }
        return request;
    }
    async updateRequestStatus(id, status) {
        return this.prisma.request.update({
            where: { id },
            data: { status },
        });
    }
    async getAllRequests(adminId, { page, limit, offset, size }, sort, search) {
        const response = await this.prisma.request.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'createdAt']: sort?.direction || 'asc',
                },
            ],
            where: search.field && search.searchParam
                ? {
                    assignedToId: adminId,
                    [search.field]: {
                        contains: search.searchParam,
                        mode: 'insensitive',
                    },
                }
                : { assignedToId: adminId },
        });
        const promises = response.map(async (res) => {
            return {
                ...res,
                createdBy: await this.prisma.user.findUnique({
                    where: { id: res.createdById },
                }),
            };
        });
        const toSend = await Promise.all(promises);
        return {
            data: toSend,
            dataSize: toSend.length,
            page,
            size,
        };
    }
    async createTaskInstanceRequest(data) {
        return this.prisma.request.create({
            data: {
                type: client_1.RequestType.TASK_INSTANCE_CREATION,
                details: data.details,
                createdById: data.createdById,
                assignedToId: data.addressedToId,
                status: client_1.Status.PENDING,
            },
        });
    }
    async updateTaskInstanceRequest(id, data, createdById) {
        return this.prisma.request.create({
            data: {
                type: client_1.RequestType.TASK_INSTANCE_UPDATE,
                details: data,
                createdById: createdById,
                assignedToId: createdById,
                status: client_1.Status.PENDING,
            },
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map