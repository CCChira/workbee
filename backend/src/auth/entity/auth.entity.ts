import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: string;
}
