import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { PlanType } from '@common/enum';

import { BaseEntity } from '@shared/entity';

import { FeatureFlag } from '@modules/feature-flag/entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.FREE })
  plan: PlanType;

  @Column('varchar', { name: 'api_key', nullable: true, unique: true })
  apiKey: string | null;

  @OneToMany(() => FeatureFlag, flag => flag.tenant)
  featureFlags: Relation<FeatureFlag>[];
}
