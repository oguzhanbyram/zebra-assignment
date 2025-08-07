import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '@shared/entity';

import { FeatureFlag } from '@modules/feature-flag/entity';

@Entity('features')
export class Feature extends BaseEntity {
  @Column('varchar', { unique: true })
  key: string;

  @Column('varchar')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => FeatureFlag, flag => flag.feature)
  featureFlags: Relation<FeatureFlag>[];
}
