import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  startDate: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clientId: string;

  @IsString()
  @ApiProperty()
  pdfUrl: string;
}
