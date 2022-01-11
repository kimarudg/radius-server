import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Equals,
  IsInt,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Profile } from './../models/profile.model';
import { ProfileInput } from './profile.validator';
export class UserInput {
  @IsNotEmpty()
  @IsEmail({
    message: 'Invalid email address',
  })
  email: string;

  @IsNotEmpty()
  @IsString({
    message: 'Invalid value for password',
  })
  password: string;

  @IsNotEmpty()
  @IsString({
    message: 'Invalid value for phone number',
  })
  phone: string;

  @IsNotEmpty()
  @ValidateNested()
  profile: Profile;
}
