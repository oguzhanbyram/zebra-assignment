import { ApiProperty } from '@nestjs/swagger';

import { Environment, StrategyType } from '@modules/feature-flag/enum';

export class FeatureFlagResponseDto {
  @ApiProperty({ format: 'uuid', description: 'Unique identifier of the feature flag' })
  id: string;

  @ApiProperty({ format: 'uuid', description: 'Tenant ID' })
  tenantId: string;

  @ApiProperty({ description: 'Tenant name' })
  tenantName: string;

  @ApiProperty({ format: 'uuid', description: 'Feature ID' })
  featureId: string;

  @ApiProperty({ description: 'Feature key associated with the flag' })
  featureKey: string;

  @ApiProperty({
    type: () => Environment,
    enum: Environment,
    description: 'Environment where the flag is active',
  })
  environment: Environment;

  @ApiProperty({ type: 'boolean', description: 'Whether the feature is enabled or not' })
  enabled: boolean;

  @ApiProperty({
    type: () => StrategyType,
    enum: StrategyType,
    description: 'Evaluation strategy type',
  })
  strategy: StrategyType;

  @ApiProperty({
    type: () => Object,
    required: false,
    description: 'Optional strategy configuration (e.g., percentage, targeting)',
  })
  value?: Record<string, any>;
}
