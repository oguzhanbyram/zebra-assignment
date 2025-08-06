import { SelectQueryBuilder } from 'typeorm';

export interface EntityFilter<Entity> {
  apply(qb: SelectQueryBuilder<Entity>, alias?: string): SelectQueryBuilder<Entity>;
}
