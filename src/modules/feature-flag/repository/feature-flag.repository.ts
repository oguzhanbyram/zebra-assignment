import { Pageable, Page } from '@common/dto';

import { BaseRepository } from '@shared/repository';

import { FeatureFlag } from '@modules/feature-flag/entity';
import { Environment } from '@modules/feature-flag/enum';

import { FeatureFlagFilterDto } from '../dto';

export interface FeatureFlagRepository extends BaseRepository<FeatureFlag> {
  findAll(pageable: Pageable, filter?: FeatureFlagFilterDto): Promise<Page<FeatureFlag>>;

  findByTenantAndFeatureAndEnv(
    tenantId: string,
    featureId: string,
    environment: Environment,
  ): Promise<FeatureFlag | null>;

  findByTenantNameAndFeatureNameAndEnv(
    tenant: string,
    feature: string,
    environment: Environment,
  ): Promise<FeatureFlag | null>;
}
