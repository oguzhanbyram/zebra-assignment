import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Environment } from '@modules/feature-flag/enum';

export class EvaluateFeatureFlagDto {
  @ApiProperty({ description: 'Tenant name', example: 'zebra' })
  @IsString()
  @IsNotEmpty()
  tenant: string;

  @ApiProperty({
    type: () => Environment,
    enum: Environment,
    description: 'Environment where the feature flag is evaluated',
    example: Environment.DEV,
  })
  @IsEnum(Environment)
  environment: Environment;

  @ApiProperty({ description: 'Feature name to evaluate', example: 'beta-feature' })
  @IsString()
  @IsNotEmpty()
  feature: string;

  @ApiProperty({ description: 'User ID to evaluate feature against', example: 'user-1234', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}
