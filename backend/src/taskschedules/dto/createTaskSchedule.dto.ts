// src/task-schedules/dto/create-task-schedule.dto.ts
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskScheduleDto {
  @IsInt()
  @ApiProperty()
  taskTemplateId: number;

  @IsString()
  @ApiProperty()
  description: string;

  @IsArray()
  @IsInt({ each: true })
  @ApiProperty()
  dayOfWeek: number[];

  @IsArray()
  @IsInt({ each: true })
  @ApiProperty()
  frequency: number[];

  @IsDateString()
  @ApiProperty()
  startDate: string;

  @IsDateString()
  @ApiProperty()
  endDate: string;

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;

  @IsInt()
  @ApiProperty()
  roomId: number;

  @IsString()
  @ApiProperty()
  hour: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
