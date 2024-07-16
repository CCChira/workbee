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
exports.TaskSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let TaskSchedulesService = class TaskSchedulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateTaskDates(daysOfWeek, weeksOfInterval, startDate, endDate) {
        const daysToNos = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 0,
        };
        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentWeekStart = (0, date_fns_1.startOfWeek)(start, { weekStartsOn: 1 });
        const days = (0, date_fns_1.eachDayOfInterval)({ start: currentWeekStart, end: end });
        return days.filter((day, index) => {
            if (weeksOfInterval.includes(Math.floor((index % 28) / 7))) {
                if (daysOfWeek.includes(daysToNos[(0, date_fns_1.format)(day, 'EEEE')] % 7)) {
                    return day;
                }
            }
        });
    }
    async createTaskSchedule(dto) {
        const taskSchedule = await this.prisma.taskSchedule.create({
            data: {
                taskTemplateId: dto.taskTemplateId,
                dayOfWeek: dto.dayOfWeek,
                frequency: dto.frequency,
                description: dto.description,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                hour: dto.hour,
                isActive: dto.isActive,
                roomId: dto.roomId,
            },
        });
        const taskDates = this.generateTaskDates(dto.dayOfWeek, dto.frequency, dto.startDate, dto.endDate);
        const taskInstances = taskDates.map((date) => ({
            taskScheduleId: taskSchedule.id,
            status: client_1.Status.UNASSIGNED,
            hour: dto.hour,
            date: date,
            roomId: taskSchedule.roomId,
        }));
        await this.prisma.taskInstance.createMany({
            data: taskInstances,
        });
        return taskSchedule;
    }
};
exports.TaskSchedulesService = TaskSchedulesService;
exports.TaskSchedulesService = TaskSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskSchedulesService);
//# sourceMappingURL=taskschedules.service.js.map