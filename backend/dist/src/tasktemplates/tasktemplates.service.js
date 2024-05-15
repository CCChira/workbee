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
exports.TaskTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TaskTemplatesService = class TaskTemplatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTaskTemplate(dto) {
        return this.prisma.taskTemplate.create({
            data: {
                title: dto.title,
                necessaryWorkers: dto.necessaryWorkers,
                necessaryTools: dto.necessaryTools,
                contractId: dto.contractId ?? null,
            },
        });
    }
    async createMultipleTaskTemplates(dto) {
        const taskTemplatesData = dto.map((template) => ({
            title: template.title,
            necessaryWorkers: template.necessaryWorkers,
            necessaryTools: template.necessaryTools,
            contractId: template.contractId ?? null,
        }));
        return this.prisma.taskTemplate.createMany({
            data: taskTemplatesData,
            skipDuplicates: true,
        });
    }
    async findAllTaskTemplates(contractId, { page, limit, offset, size }, sort, search) {
        const response = await this.prisma.taskTemplate.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'desc',
                },
            ],
            where: contractId
                ? search?.field && search?.searchParam
                    ? {
                        contractId: contractId,
                        [search.field]: {
                            contains: search.searchParam,
                            mode: 'insensitive',
                        },
                    }
                    : { contractId: contractId }
                : search?.field && search?.searchParam
                    ? {
                        [search.field]: {
                            contains: search.searchParam,
                            mode: 'insensitive',
                        },
                    }
                    : {},
            select: {
                id: true,
                title: true,
                necessaryWorkers: true,
                necessaryTools: true,
                contractId: true,
                TaskSchedule: {
                    select: {
                        id: true,
                        description: true,
                        isActive: true,
                        status: true,
                    },
                },
                _count: {
                    select: {
                        TaskSchedule: true,
                    },
                },
            },
        });
        return {
            data: response,
            dataSize: response.length,
            page,
            size,
        };
    }
    findTaskTemplate(taskTemplateId) {
        return this.prisma.taskTemplate.findUnique({
            where: { id: taskTemplateId },
        });
    }
    async getTaskTemplatesCount() {
        const totalCount = await this.prisma.taskTemplate.count();
        const usedCount = await this.prisma.taskTemplate.count({
            where: {
                TaskSchedule: {
                    some: {},
                },
            },
        });
        const instancesToday = await this.prisma.taskInstance.count({
            where: {
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
        });
        const today = new Date();
        const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        const instancesNext7Days = await this.prisma.taskInstance.count({
            where: {
                date: {
                    gte: today,
                    lt: nextWeek,
                },
            },
        });
        return {
            totalCount,
            usedCount,
            instancesToday,
            instancesNext7Days,
        };
    }
};
exports.TaskTemplatesService = TaskTemplatesService;
exports.TaskTemplatesService = TaskTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskTemplatesService);
//# sourceMappingURL=tasktemplates.service.js.map