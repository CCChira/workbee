import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  necessaryWorkers: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  necessaryTools: string[];

  @IsInt()
  @ApiProperty({ required: false })
  contractId?: number;
}
