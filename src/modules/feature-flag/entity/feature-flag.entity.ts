import { Column, Entity, ManyToOne, JoinColumn, Unique, RelationId, Relation } from 'typeorm';

import { BaseEntity } from '@shared/entity';

import { Feature } from '@modules/feature/entity/feature.entity';
import { Tenant } from '@modules/tenant/entity/tenant.entity';

import { Environment, StrategyType } from '../enum';

@Entity('feature_flags')
@Unique(['tenant', 'feature', 'environment'])
export class FeatureFlag extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Relation<Tenant>;

  @RelationId((flag: FeatureFlag) => flag.tenant)
  tenantId: string;

  @ManyToOne(() => Feature, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id' })
  feature: Relation<Feature>;

  @RelationId((flag: FeatureFlag) => flag.feature)
  featureId: string;

  @Column({ type: 'enum', enum: Environment })
  environment: Environment;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'enum', enum: StrategyType, default: StrategyType.BOOLEAN })
  strategy: StrategyType;

  @Column({ type: 'jsonb', nullable: true })
  value?: Record<string, any>;
}
