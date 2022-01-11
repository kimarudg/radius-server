import { IsDate, IsOptional, IsString } from 'class-validator';

export class ProfileInput {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsDate()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  ajiraId?: string;
}
