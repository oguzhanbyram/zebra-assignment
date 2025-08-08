import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { PlanType } from '@common/enum';

export class CreateTenantDto {
  @ApiProperty({ example: 'acme-corp' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'ACME Corporation', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PlanType, default: PlanType.FREE, required: false })
  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;
}
