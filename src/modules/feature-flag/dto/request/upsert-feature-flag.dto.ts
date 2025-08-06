import { ApiProperty } from '@nestjs/swagger';

import { IsUUID, IsBoolean, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

import { Environment, StrategyType } from '@modules/feature-flag/enum';

export class UpsertFeatureFlagDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  @IsNotEmpty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  @IsNotEmpty()
  @IsUUID()
  featureId: string;

  @ApiProperty({
    type: () => Environment,
    enum: Environment,
    example: Environment.DEV,
  })
  @IsNotEmpty()
  @IsEnum(Environment)
  environment: Environment;

  @ApiProperty({ example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    type: () => StrategyType,
    enum: StrategyType,
    example: StrategyType.BOOLEAN,
  })
  @IsNotEmpty()
  @IsEnum(StrategyType)
  strategy: StrategyType;

  @ApiProperty({
    example: { key: 'value' },
    required: false,
    description: 'Additional configuration for the feature flag strategy.',
  })
  @IsOptional()
  value?: Record<string, any>;
}
