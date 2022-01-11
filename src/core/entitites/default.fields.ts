import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AsEither, AsInput, AsOutput } from '../validators';

export class DefaultFields {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional(AsEither)
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Column({ name: 'archived', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  archived?: boolean;

  @Column({ name: 'deleted', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  deleted?: boolean;

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  dateCreated?: Date;

  @UpdateDateColumn({ name: 'last_updated', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  lastUpdated?: Date;

  @Column({ name: 'date_deleted', nullable: true, type: 'timestamptz' })
  @IsOptional(AsEither)
  @IsDate(AsOutput)
  @ApiResponseProperty()
  dateDeleted?: Date;

  @Column({ name: 'last_updated_by', nullable: true })
  @IsOptional(AsEither)
  @IsEmpty(AsInput)
  @IsString(AsOutput)
  @ApiResponseProperty()
  lastUpdatedBy?: string;

  @Column({ name: 'created_by', nullable: true })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  createdBy?: string;

  @Column({ name: 'meta_data', type: 'jsonb', nullable: true, default: {} })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  metaData?: { [key: string]: any };
}
