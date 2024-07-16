import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskScheduleDto } from './dto/createTaskSchedule.dto';
import { Status } from '@prisma/client';
import { eachDayOfInterval, format, startOfWeek } from 'date-fns';

@Injectable()
export class TaskSchedulesService {
  constructor(private prisma: PrismaService) {}

  private generateTaskDates(
    daysOfWeek: number[],
    weeksOfInterval: number[],
    startDate: string,
    endDate: string,
  ): Date[] {
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
    const currentWeekStart = startOfWeek(start, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: currentWeekStart, end: end });

    return days.filter((day, index) => {
      if (weeksOfInterval.includes(Math.floor((index % 28) / 7))) {
        if (daysOfWeek.includes(daysToNos[format(day, 'EEEE')] % 7)) {
          return day;
        }
      }
    });
  }

  async createTaskSchedule(dto: CreateTaskScheduleDto) {
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

    const taskDates = this.generateTaskDates(
      dto.dayOfWeek,
      dto.frequency,
      dto.startDate,
      dto.endDate,
    );

    const taskInstances = taskDates.map((date) => ({
      taskScheduleId: taskSchedule.id,
      status: Status.UNASSIGNED,
      hour: dto.hour,
      date: date,
      roomId: taskSchedule.roomId,
    }));

    await this.prisma.taskInstance.createMany({
      data: taskInstances,
    });

    return taskSchedule;
  }
}
