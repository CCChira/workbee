import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessMode } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  locationId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageGroup: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessMode: AccessMode;
  @IsArray()
  @ArrayMinSize(0)
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  imageFiles: Express.Multer.File[];
}
