import { Inject, Injectable } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { FEATURE_SERVICE, FeatureService } from '@modules/feature';
import { FEATURE_FLAG_REPOSITORY } from '@modules/feature-flag';
import { UpsertFeatureFlagDto, FeatureFlagFilterDto, EvaluateFeatureFlagDto } from '@modules/feature-flag/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { StrategyType } from '@modules/feature-flag/enum';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FeatureFlagService } from '@modules/feature-flag/service';
import { TENANT_SERVICE, TenantService } from '@modules/tenant';

@Injectable()
export class FeatureFlagServiceImpl implements FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY)
    private readonly featureFlagRepository: FeatureFlagRepository,
    @Inject(TENANT_SERVICE)
    private readonly tenantService: TenantService,
    @Inject(FEATURE_SERVICE)
    private readonly featureService: FeatureService,
  ) {}

  findAll(pageable: Pageable, filter: FeatureFlagFilterDto): Promise<Page<FeatureFlag>> {
    return this.featureFlagRepository.findAll(pageable, filter);
  }

  async upsert(data: UpsertFeatureFlagDto): Promise<FeatureFlag> {
    const { tenantId, featureId, environment, ...rest } = data;

    const existing = await this.featureFlagRepository.findByTenantAndFeatureAndEnv(tenantId, featureId, environment);

    if (existing) {
      return this.featureFlagRepository.update(existing.id, rest);
    }

    return this.featureFlagRepository.create({
      tenant: { id: tenantId },
      feature: { id: featureId },
      environment,
      ...rest,
    });
  }

  delete(id: string): Promise<boolean> {
    return this.featureFlagRepository.delete(id);
  }

  async evaluate(dto: EvaluateFeatureFlagDto): Promise<boolean> {
    const { tenant, feature, environment, userId } = dto;

    const tenantEntity = await this.tenantService.findByName(tenant);
    const featureEntity = await this.featureService.findByName(feature);

    if (!tenantEntity || !featureEntity) {
      return false;
    }

    const flag = await this.featureFlagRepository.findByTenantNameAndFeatureNameAndEnv(
      tenantEntity.name,
      featureEntity.name,
      environment,
    );

    if (!flag || !flag.enabled) {
      return false;
    }

    let result: boolean = false;

    switch (flag.strategy) {
      case StrategyType.BOOLEAN:
        result = true;
        break;
      case StrategyType.PERCENTAGE:
        result = this.evaluatePercentage(userId, flag.value?.percentage);
        break;
      case StrategyType.TARGETING:
        result = this.evaluateTargeting(userId, flag.value);
        break;
    }

    return result;
  }

  private evaluatePercentage(userId: string, percentage?: number): boolean {
    if (!percentage || percentage <= 0) return false;
    const hash = this.hashUserId(userId);
    return hash % 100 < percentage;
  }

  private evaluateTargeting(userId: string, value: any): boolean {
    if (!value || !Array.isArray(value.userIds)) return false;
    return value.userIds.includes(userId);
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
