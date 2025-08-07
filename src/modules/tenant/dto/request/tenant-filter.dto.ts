import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { PlanType } from '@common/enum';
import { EntityFilter } from '@common/filter';

import { Tenant } from '@modules/tenant/entity';

export class TenantFilterDto implements EntityFilter<Tenant> {
  @ApiPropertyOptional({ description: 'Partial match on the name (ILIKE)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: () => PlanType, enum: PlanType, description: 'Filter by plan type' })
  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

  apply(qb: SelectQueryBuilder<Tenant>, alias = 'tenant'): SelectQueryBuilder<Tenant> {
    if (this.name) {
      qb.andWhere(`${alias}.name ILIKE :name`, { name: `%${this.name}%` });
    }

    if (this.plan) {
      qb.andWhere(`${alias}.plan = :plan`, { plan: this.plan });
    }

    return qb;
  }
}
