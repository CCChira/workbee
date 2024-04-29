import { IsNotEmpty } from 'class-validator';

export class DeleteMultipleUsersDto {
  @IsNotEmpty()
  users: string[];
}
