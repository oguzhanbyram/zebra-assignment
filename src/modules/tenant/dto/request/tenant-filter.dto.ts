import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { EntityFilter } from '@common/filter';

import { Tenant } from '@modules/tenant/entity';

export class TenantFilterDto implements EntityFilter<Tenant> {
  @ApiPropertyOptional({ description: 'Partial match on the name (ILIKE)' })
  @IsOptional()
  @IsString()
  name?: string;

  apply(qb: SelectQueryBuilder<Tenant>, alias = 'tenant'): SelectQueryBuilder<Tenant> {
    if (this.name) {
      qb.andWhere(`${alias}.name ILIKE :name`, { name: `%${this.name}%` });
    }

    return qb;
  }
}
