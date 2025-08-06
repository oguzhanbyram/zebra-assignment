import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { slugger } from '@shared/utils';

export class CreateTenantDto {
  @ApiProperty({ example: 'My Tenant', maxLength: 50, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => slugger(value))
  name: string;

  @ApiProperty({ example: 'This is a description of my tenant.', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
