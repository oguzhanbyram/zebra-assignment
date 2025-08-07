import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { PLAN_TYPES, PlanType } from '@common/constants';

import { BaseEntity } from '@shared/entity';

import { FeatureFlag } from '@modules/feature-flag/entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PLAN_TYPES,
    default: 'free',
  })
  plan: PlanType;

  @Column('varchar', { name: 'api_key', nullable: true, unique: true })
  apiKey: string | null;

  @OneToMany(() => FeatureFlag, flag => flag.tenant)
  featureFlags: Relation<FeatureFlag>[];
}
