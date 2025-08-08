import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Pageable, Page } from '@common/dto';

import { BaseRepositoryImpl } from '@shared/repository';
import { PaginationUtil } from '@shared/utils';

import { FeatureFlag } from '@modules/feature-flag/entity';
import { Environment } from '@modules/feature-flag/enum';
import { FeatureFlagRepository } from '@modules/feature-flag/repository/feature-flag.repository';

import { FeatureFlagFilterDto } from '../dto';

@Injectable()
export class FeatureFlagRepositoryImpl extends BaseRepositoryImpl<FeatureFlag> implements FeatureFlagRepository {
  constructor(
    @InjectRepository(FeatureFlag)
    repo: Repository<FeatureFlag>,
  ) {
    super(repo);
  }

  findAll(pageable: Pageable, filter?: FeatureFlagFilterDto): Promise<Page<FeatureFlag>> {
    const qb = this.repo
      .createQueryBuilder('feature_flag')
      .leftJoinAndSelect('feature_flag.tenant', 'tenants')
      .leftJoinAndSelect('feature_flag.feature', 'features');

    if (filter) {
      filter.apply(qb, 'feature_flag');
    }

    return PaginationUtil.paginate(qb, pageable);
  }

  findByTenantAndFeatureAndEnv(
    tenantId: string,
    featureId: string,
    environment: Environment,
  ): Promise<FeatureFlag | null> {
    return this.repo
      .createQueryBuilder('feature_flag')
      .leftJoinAndSelect('feature_flag.tenant', 'tenant')
      .leftJoinAndSelect('feature_flag.feature', 'feature')
      .where('feature_flag.tenant_id = :tenantId', { tenantId })
      .andWhere('feature_flag.feature_id = :featureId', { featureId })
      .andWhere('feature_flag.environment = :environment', { environment })
      .getOne();
  }

  async findByTenantNameAndFeatureNameAndEnv(
    tenant: string,
    feature: string,
    environment: Environment,
  ): Promise<FeatureFlag | null> {
    return this.repo
      .createQueryBuilder('feature_flag')
      .leftJoinAndSelect('feature_flag.tenant', 'tenant')
      .leftJoinAndSelect('feature_flag.feature', 'feature')
      .where('tenant.name = :tenant', { tenant })
      .andWhere('feature.key = :feature', { feature })
      .andWhere('feature_flag.environment = :environment', { environment })
      .getOne();
  }

  async findById(id: string): Promise<FeatureFlag | null> {
    const flag = await this.repo.findOne({
      where: { id },
      relations: ['tenant', 'feature'],
    });

    return flag;
  }
}
