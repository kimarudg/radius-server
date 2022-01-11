import { DefaultFields } from './../../core/entitites/default.fields';
import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { AsEither, AsInput, AsOutput } from '../../core/validators';
import { Profile } from './profile.model';

@Entity({ name: 'users' })
@Unique(['email'])
export class UserModel extends DefaultFields {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @Index({ unique: true })
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Column({ name: 'email', nullable: false })
  @IsNotEmpty(AsEither)
  @IsEmail()
  @Index({ unique: true })
  @ApiResponseProperty()
  email: string;

  @Column({ name: 'phone', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString()
  @MaxLength(14)
  @IsNumberString()
  @Index({ unique: true })
  @ApiResponseProperty()
  phone: string;

  @Column({ name: 'password_hash', nullable: false })
  @IsNotEmpty(AsInput)
  @IsString(AsEither)
  passwordHash?: string;

  @Column({ name: 'need_password_change', default: true })
  @IsDefined(AsOutput)
  @ApiResponseProperty()
  needPasswordChange?: boolean;

  @Column({
    name: 'last_login',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  @IsDefined(AsOutput)
  @IsDate(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  lastLogin?: Date;

  @Column({ name: 'login_count', default: 0 })
  @IsDefined(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  loginCount?: number;

  @Column({ name: 'failed_logins', default: 0 })
  @IsDefined(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  failedLogins?: number;

  @Column({ name: 'confirmed', default: false })
  @IsDefined(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  confirmed?: boolean;

  @Column({ name: 'active', default: false })
  @IsDefined(AsOutput)
  @ApiResponseProperty()
  active?: boolean;

  @Column({
    name: 'last_seen',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  @IsDefined(AsOutput)
  @IsDate(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  lastSeen?: Date;

  @Column({ name: 'avatar_hash', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  avatarHash?: string;

  @Column({ name: 'identity_provider', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  identityProvider?: string;

  @Column({ name: 'profile', type: 'jsonb', nullable: true })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  profile?: Profile;
}
