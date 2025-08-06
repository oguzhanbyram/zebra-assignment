import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { EntityFilter } from '@common/filter';

import { FeatureFlag } from '@modules/feature-flag/entity';
import { Environment } from '@modules/feature-flag/enum';

export class FeatureFlagFilterDto implements EntityFilter<FeatureFlag> {
  @ApiPropertyOptional({ description: 'Tenant name' })
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({
    type: () => Environment,
    enum: Environment,
    description: 'Filter by environment',
    example: Environment.DEV,
  })
  @IsOptional()
  @IsEnum(Environment)
  env?: Environment;

  apply(qb: SelectQueryBuilder<FeatureFlag>, alias = 'feature_flag'): SelectQueryBuilder<FeatureFlag> {
    if (this.tenant) {
      qb.andWhere(`tenants.name ILIKE :tenant`, { tenant: `%${this.tenant}%` });
    }

    if (this.env) {
      qb.andWhere(`${alias}.environment = :env`, { env: this.env });
    }

    return qb;
  }
}
