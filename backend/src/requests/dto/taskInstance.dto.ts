// src/task-instances/dto/create-task-instance.dto.ts
// src/task-instances/dto/update-task-instance.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class CreateTaskInstanceDto {
  @IsInt()
  @ApiProperty()
  taskScheduleId: number;

  @IsString()
  @ApiProperty()
  date: string;

  @IsString()
  @ApiProperty()
  hour: string;

  @IsString()
  @ApiProperty()
  status: Status;

  @IsInt()
  @ApiProperty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}

export class UpdateTaskInstanceDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  taskScheduleId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  hour?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  roomId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  userId?: string;
}
