import { IsOptional, IsString } from 'class-validator';

export class Profile {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
