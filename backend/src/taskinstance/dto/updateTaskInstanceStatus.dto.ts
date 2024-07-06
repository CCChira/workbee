import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTaskInstanceStatusDto {
  @IsEnum(Status)
  status: Status;
}
