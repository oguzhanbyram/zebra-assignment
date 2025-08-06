import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '@shared/entity';

import { FeatureFlag } from '@modules/feature-flag/entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => FeatureFlag, flag => flag.tenant)
  featureFlags: Relation<FeatureFlag>[];
}
