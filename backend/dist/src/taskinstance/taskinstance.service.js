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
exports.TaskinstanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TaskinstanceService = class TaskinstanceService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    createTaskInstance(taskInstanceDto) {
        return this.prismaService.taskInstance.create({
            data: {
                status: taskInstanceDto.status,
                date: new Date(taskInstanceDto.date),
                hour: taskInstanceDto.hour,
                roomId: taskInstanceDto.roomId,
            },
        });
    }
    updateTaskInstance(instanceId, updateTaskInstanceDto) {
        return this.prismaService.taskInstance.update({
            where: { id: instanceId },
            data: updateTaskInstanceDto,
        });
    }
    deleteTaskInstance(instanceId) {
        return this.prismaService.taskInstance.delete({
            where: { id: instanceId },
        });
    }
    async getTaskInstance(instanceId) {
        return this.prismaService.taskInstance.findUnique({
            where: { id: instanceId },
        });
    }
    async getTaskInstancesByTaskScheduleId(taskScheduleId) {
        return this.prismaService.taskInstance.findMany({
            where: { taskScheduleId: taskScheduleId },
        });
    }
    async getTaskInstancesByDateInterval(startDate, endDate) {
        return this.prismaService.taskInstance.findMany({
            where: {
                AND: [
                    { date: { gte: new Date(startDate) } },
                    { date: { lte: new Date(endDate) } },
                ],
            },
        });
    }
    async getTasksAssignedToUser(userId) {
        return this.prismaService.taskInstance.findMany({
            where: {
                TaskAssignment: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                TaskAssignment: true,
                room: true,
                taskSchedule: true,
            },
        });
    }
    async getTasksAssignedToUserWithinInterval(userId, startDate, endDate) {
        return this.prismaService.taskInstance.findMany({
            where: {
                AND: [
                    {
                        TaskAssignment: {
                            some: {
                                userId: userId,
                            },
                        },
                    },
                    {
                        date: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                ],
            },
            include: {
                TaskAssignment: true,
                room: true,
                taskSchedule: true,
            },
        });
    }
    async getAllTaskInstances({ page, limit, offset, size }, sort, search) {
        const response = await this.prismaService.taskInstance.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'desc',
                },
            ],
            where: search?.field && search?.searchParam
                ? {
                    [search.field]: {
                        contains: search.searchParam,
                        mode: 'insensitive',
                    },
                }
                : {},
        });
        return {
            data: response,
            dataSize: response.length,
            page,
            size,
        };
    }
    async assignUserToTaskInstance(instanceId, userId) {
        return this.prismaService.taskAssignment.create({
            data: {
                taskId: instanceId,
                userId: userId,
            },
        });
    }
};
exports.TaskinstanceService = TaskinstanceService;
exports.TaskinstanceService = TaskinstanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskinstanceService);
//# sourceMappingURL=taskinstance.service.js.map