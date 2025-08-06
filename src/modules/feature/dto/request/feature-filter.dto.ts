import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { EntityFilter } from '@common/filter';

import { Feature } from '@modules/feature/entity';

export class FeatureFilterDto implements EntityFilter<Feature> {
  @ApiPropertyOptional({ description: 'Partial match on the name (ILIKE)' })
  @IsOptional()
  @IsString()
  name?: string;

  apply(qb: SelectQueryBuilder<Feature>, alias = 'feature'): SelectQueryBuilder<Feature> {
    if (this.name) {
      qb.andWhere(`${alias}.name ILIKE :name`, { name: `%${this.name}%` });
    }

    return qb;
  }
}
