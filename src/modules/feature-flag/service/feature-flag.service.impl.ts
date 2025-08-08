import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { PaginationUtil } from '@shared/utils';

import { FEATURE_SERVICE, FeatureService } from '@modules/feature';
import { FEATURE_FLAG_MAPPER, FEATURE_FLAG_REPOSITORY, FeatureFlagMapper } from '@modules/feature-flag';
import {
  UpsertFeatureFlagDto,
  FeatureFlagFilterDto,
  FeatureFlagResponseDto,
  EvaluateFeatureFlagDto,
} from '@modules/feature-flag/dto';
import { StrategyType } from '@modules/feature-flag/enum';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FeatureFlagService } from '@modules/feature-flag/service';
import { FeatureFlagStrategyFactory } from '@modules/feature-flag/strategy';
import { TENANT_SERVICE, TenantService } from '@modules/tenant';

@Injectable()
export class FeatureFlagServiceImpl implements FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY)
    private readonly featureFlagRepository: FeatureFlagRepository,
    @Inject(FEATURE_FLAG_MAPPER)
    private readonly featureFlagMapper: FeatureFlagMapper,
    @Inject(TENANT_SERVICE)
    private readonly tenantService: TenantService,
    @Inject(FEATURE_SERVICE)
    private readonly featureService: FeatureService,
  ) {}

  async findAll(pageable: Pageable, filter: FeatureFlagFilterDto): Promise<Page<FeatureFlagResponseDto>> {
    const page = await this.featureFlagRepository.findAll(pageable, filter);

    return PaginationUtil.mapPage(page, feature => this.featureFlagMapper.mapToFeatureFlagResponse(feature));
  }

  async upsert(dto: UpsertFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    const { tenantId, featureId, environment, enabled, strategy, value } = dto;

    const validatedValue = this.validateStrategyAndValue(strategy, value);

    const existing = await this.featureFlagRepository.findByTenantAndFeatureAndEnv(tenantId, featureId, environment);

    if (existing) {
      const updated = await this.featureFlagRepository.update(existing.id, {
        enabled,
        strategy,
        value: validatedValue,
      });

      return this.featureFlagMapper.mapToFeatureFlagResponse({
        ...updated,
        tenant: existing.tenant,
        feature: existing.feature,
        environment: existing.environment,
      });
    }

    const created = await this.featureFlagRepository.create({
      tenant: { id: tenantId },
      feature: { id: featureId },
      environment,
      enabled,
      strategy,
      value: validatedValue,
    });

    return this.featureFlagMapper.mapToFeatureFlagResponse(created);
  }

  delete(id: string): Promise<boolean> {
    return this.featureFlagRepository.delete(id);
  }

  async evaluate(data: EvaluateFeatureFlagDto): Promise<boolean> {
    const { tenant, feature, environment, userId } = data;

    const flag = await this.featureFlagRepository.findByTenantNameAndFeatureNameAndEnv(tenant, feature, environment);

    if (!flag || !flag.enabled) return false;

    const evaluator = FeatureFlagStrategyFactory.getEvaluator(flag.strategy);
    return evaluator.evaluate(userId, flag.value ?? {});
  }

  private validateStrategyAndValue(strategy: StrategyType, value?: Record<string, any>): Record<string, any> | null {
    switch (strategy) {
      case StrategyType.BOOLEAN:
        return null;

      case StrategyType.PERCENTAGE:
        if (!value || typeof value.percentage !== 'number' || value.percentage < 0 || value.percentage > 100) {
          throw new BadRequestException('PERCENTAGE strategy requires value.percentage between 0 and 100');
        }
        return { percentage: value.percentage };

      case StrategyType.TARGETING:
        if (!value || !Array.isArray(value.userIds)) {
          throw new BadRequestException('TARGETING strategy requires value.userIds as an array');
        }
        return { userIds: value.userIds };

      default:
        throw new BadRequestException(`Unsupported strategy type: ${strategy}`);
    }
  }
}
