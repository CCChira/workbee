// src/task-schedules/dto/create-task-schedule.dto.ts
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateTaskInstanceDto {
  @IsInt()
  @ApiProperty()
  taskScheduleId: number;

  @IsString()
  @ApiProperty()
  status: Status;

  @IsString()
  @ApiProperty()
  date: string;

  @IsString()
  @ApiProperty()
  hour: string;

  @IsInt()
  @ApiProperty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
