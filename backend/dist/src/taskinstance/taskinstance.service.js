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
const date_fns_1 = require("date-fns");
const client_1 = require("@prisma/client");
let TaskinstanceService = class TaskinstanceService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    createTaskInstance(taskInstanceDto) {
        return this.prismaService.taskInstance.create({
            data: {
                taskTemplateId: taskInstanceDto.taskTemplateId,
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
    async getTaskInstancesByDateInterval(startDate, endDate, contractId, roomId, locationId) {
        return this.prismaService.taskInstance.findMany({
            where: {
                AND: [
                    { date: { gte: new Date(startDate) } },
                    { date: { lte: new Date(endDate) } },
                ],
                taskSchedule: {
                    taskTemplate: {
                        contractId: contractId ? parseInt(contractId) : undefined,
                        Contract: {
                            locations: {
                                some: {
                                    id: locationId ? parseInt(locationId) : undefined,
                                },
                            },
                        },
                    },
                },
                roomId: roomId ? parseInt(roomId) : undefined,
            },
        });
    }
    async getTasksAssignedToUser(userId) {
        const response = await this.prismaService.taskInstance.findMany({
            where: {
                TaskAssignment: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                TaskAssignment: true,
                room: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
            },
        });
        return {
            data: response,
        };
    }
    async findTasksForToday(userId) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return this.prismaService.taskInstance.findMany({
            where: {
                TaskAssignment: {
                    some: {
                        userId: userId,
                    },
                },
                date: {
                    gte: todayStart,
                },
            },
            include: {
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
                room: {
                    include: {
                        location: true,
                        images: true,
                    },
                },
                taskTemplate: true,
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
                        },
                    },
                ],
            },
            include: {
                TaskAssignment: true,
                room: true,
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
            },
        });
    }
    async getTasksAssignedToUserThisWeek(userId) {
        const startOfThisWeek = (0, date_fns_1.startOfWeek)(new Date(), { weekStartsOn: 1 });
        const endOfThisWeek = (0, date_fns_1.endOfWeek)(new Date(), { weekStartsOn: 1 });
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
                            gte: startOfThisWeek,
                            lte: endOfThisWeek,
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
    async getTaskInstancesByRoomId(roomId, { page, limit, offset, size }, sort) {
        const now = new Date();
        const start = (0, date_fns_1.startOfWeek)(now);
        const end = (0, date_fns_1.endOfWeek)(now);
        const response = await this.prismaService.taskInstance.findMany({
            where: { roomId: parseInt(roomId) },
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'desc',
                },
            ],
        });
        const sortedResponse = response.sort((a, b) => {
            const aInWeek = a.date >= start && a.date <= end;
            const bInWeek = b.date >= start && b.date <= end;
            if (aInWeek && !bInWeek)
                return -1;
            if (!aInWeek && bInWeek)
                return 1;
            if (sort) {
                if (a[sort.property] < b[sort.property])
                    return sort.direction === 'asc' ? -1 : 1;
                if (a[sort.property] > b[sort.property])
                    return sort.direction === 'asc' ? 1 : -1;
            }
            return a.id - b.id;
        });
        return {
            data: sortedResponse,
            dataSize: sortedResponse.length,
            page,
            size,
        };
    }
    async assignUserToTaskInstance(instanceId, userId) {
        await this.prismaService.taskInstance.update({
            where: { id: instanceId },
            data: {
                status: client_1.Status.IN_PROGRESS,
            },
        });
        const resp = await this.prismaService.taskAssignment.create({
            data: {
                taskId: instanceId,
                userId: userId,
            },
        });
        return resp;
    }
    async deleteUserFromTaskInstance(instanceId, userId) {
        return this.prismaService.taskAssignment.delete({
            where: {
                taskId_userId: {
                    taskId: instanceId,
                    userId: userId,
                },
            },
        });
    }
    async updateTaskInstanceStatus(id, updateTaskInstanceStatusDto) {
        return this.prismaService.taskInstance.update({
            where: { id },
            data: { status: updateTaskInstanceStatusDto.status },
        });
    }
    async getStatusCounts() {
        const today = new Date();
        const currentWeekStart = (0, date_fns_1.startOfWeek)(today, { weekStartsOn: 1 });
        const currentWeekEnd = (0, date_fns_1.endOfWeek)(today, { weekStartsOn: 1 });
        return this.prismaService.taskInstance.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
            where: {
                status: {
                    in: ['IN_PROGRESS', 'COMPLETED', 'INCOMPLETE'],
                },
                date: {
                    gte: currentWeekStart,
                    lte: currentWeekEnd,
                },
            },
        });
    }
    parseDuration(duration) {
        let minutes = 0;
        const hoursMatch = duration.match(/(\d+)h/);
        const minutesMatch = duration.match(/(\d+)m/);
        if (hoursMatch) {
            minutes += parseInt(hoursMatch[1], 10) * 60;
        }
        if (minutesMatch) {
            minutes += parseInt(minutesMatch[1], 10);
        }
        return minutes;
    }
    getRandomDuration() {
        const durations = ['30m', '45m', '1h15m', '1h30m'];
        const randomIndex = Math.floor(Math.random() * durations.length);
        return durations[randomIndex];
    }
    async fetchTaskLoadAndEfficiency() {
        const tasks = await this.prismaService.taskInstance.findMany({
            include: {
                taskTemplate: {
                    select: {
                        title: true,
                        duration: true,
                    },
                },
                taskSchedule: {
                    include: {
                        taskTemplate: {
                            select: { title: true, duration: true },
                        },
                    },
                },
            },
        });
        const data = tasks.reduce((acc, task) => {
            const monthYear = `${task.date.getMonth() + 1}-${task.date.getFullYear()}`;
            const durationInMinutes = this.parseDuration(this.getRandomDuration());
            if (!acc[monthYear]) {
                acc[monthYear] = {};
            }
            if (task.taskSchedule) {
                if (!acc[monthYear][task.taskSchedule.taskTemplate.title]) {
                    acc[monthYear][task.taskSchedule.taskTemplate.title] = {
                        count: 0,
                        totalDuration: 0,
                    };
                }
                if (acc[monthYear][task.taskSchedule.taskTemplate.title]) {
                    acc[monthYear][task.taskSchedule.taskTemplate.title].count += 1;
                    acc[monthYear][task.taskSchedule.taskTemplate.title].totalDuration +=
                        durationInMinutes;
                }
            }
            return acc;
        }, {});
        const categories = Object.keys(data).sort();
        const seriesVolume = Object.keys(data).map((month) => {
            const monthData = data[month];
            return {
                name: month,
                data: Object.values(monthData).map((d) => d.count),
            };
        });
        const seriesDuration = Object.keys(data).map((month) => {
            const monthData = data[month];
            return {
                name: month,
                data: Object.values(monthData).map((d) => d.totalDuration / d.count),
            };
        });
        return { categories, seriesVolume, seriesDuration };
    }
    async getUnderstaffedTaskInstances() {
        const taskInstances = await this.prismaService.taskInstance.findMany({
            include: {
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
                TaskAssignment: true,
            },
            where: {
                date: {
                    gt: new Date(),
                },
            },
            take: 10,
        });
        return taskInstances.map((ti) => {
            return {
                id: ti.id,
                title: ti.taskSchedule.taskTemplate.title,
                date: (0, date_fns_1.format)(ti.date, 'E'),
                neededWorkers: ti.taskSchedule.taskTemplate.necessaryWorkers,
                assignedWorkers: ti.TaskAssignment.length,
            };
        });
    }
    async getTaskInstancesThisMonth() {
        const today = new Date();
        const start = (0, date_fns_1.startOfMonth)(today);
        const end = (0, date_fns_1.endOfMonth)(today);
        const response = await this.prismaService.taskInstance.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
            },
        });
        return response.reduce((acc, curr) => {
            const key = (0, date_fns_1.format)(curr.date, 'd');
            if (acc[key]) {
                acc[key].push(curr);
            }
            else {
                acc[key] = [curr];
            }
            return acc;
        }, {});
    }
    async getTaskStatusCounts(monthRange) {
        const statusCounts = await this.prismaService.taskInstance.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
            where: monthRange.start && monthRange.end
                ? {
                    updatedAt: {
                        gte: new Date(monthRange.start),
                        lte: new Date(monthRange.end),
                    },
                }
                : undefined,
        });
        return statusCounts.map((item) => ({
            status: item.status,
            count: item._count.id,
        }));
    }
    async getTaskInstancesByDateState(month, year, contractId, roomId, userId, includeWorkers, locationId) {
        const date = (0, date_fns_1.parse)(`${year}-${month}`, 'yyyy-MMMM', new Date());
        const start = (0, date_fns_1.startOfMonth)(date);
        const end = (0, date_fns_1.endOfMonth)(date);
        console.log(contractId);
        const response = (await this.prismaService.taskInstance.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                taskSchedule: {
                    taskTemplate: {
                        contractId: contractId ? parseInt(contractId) : undefined,
                        Contract: locationId
                            ? {
                                locations: {
                                    some: {
                                        id: locationId ? parseInt(locationId) : undefined,
                                    },
                                },
                            }
                            : undefined,
                    },
                },
                TaskAssignment: userId
                    ? {
                        some: {
                            userId: userId,
                        },
                    }
                    : undefined,
                roomId: roomId ? parseInt(roomId) : undefined,
            },
            include: {
                taskSchedule: {
                    include: {
                        taskTemplate: true,
                    },
                },
                TaskAssignment: {
                    include: {
                        user: true,
                    },
                },
            },
        })).reduce((acc, curr) => {
            const key = (0, date_fns_1.format)(curr.date, 'd');
            if (acc[key]) {
                acc[key].push(curr);
            }
            else {
                acc[key] = [curr];
            }
            return acc;
        }, {});
        return response;
    }
};
exports.TaskinstanceService = TaskinstanceService;
exports.TaskinstanceService = TaskinstanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskinstanceService);
//# sourceMappingURL=taskinstance.service.js.map