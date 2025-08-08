import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Cache } from 'cache-manager';

import { Page, Pageable } from '@common/dto';
import { AuditAction } from '@common/enum';

import { PaginationUtil } from '@shared/utils';

import { AUDIT_LOG_SERVICE, AuditLogService } from '@modules/audit-log';
import {
  FEATURE_FLAG_MAPPER,
  FEATURE_FLAG_PROMOTER_SERVICE,
  FEATURE_FLAG_REPOSITORY,
  FeatureFlagMapper,
} from '@modules/feature-flag';
import {
  UpsertFeatureFlagDto,
  FeatureFlagFilterDto,
  FeatureFlagResponseDto,
  EvaluateFeatureFlagDto,
  PromoteFeatureFlagsDto,
  PromoteFeatureFlagsResponseDto,
} from '@modules/feature-flag/dto';
import { FeatureFlagEventType, StrategyType } from '@modules/feature-flag/enum';
import { FeatureFlagEvent } from '@modules/feature-flag/event';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FeatureFlagPromoterService, FeatureFlagService } from '@modules/feature-flag/service';
import { FeatureFlagStrategyFactory } from '@modules/feature-flag/strategy';

const EVALUATE_CACHE_TTL_MS = 86400000;

@Injectable()
export class FeatureFlagServiceImpl implements FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY)
    private readonly featureFlagRepository: FeatureFlagRepository,
    @Inject(FEATURE_FLAG_MAPPER)
    private readonly featureFlagMapper: FeatureFlagMapper,
    @Inject(AUDIT_LOG_SERVICE)
    private readonly auditLogService: AuditLogService,
    @Inject(FEATURE_FLAG_PROMOTER_SERVICE)
    private readonly featureFlagPromoterService: FeatureFlagPromoterService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
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

      await this.auditLogService.create({
        action: AuditAction.UPDATE,
        resource: 'feature_flag',
        resourceId: updated.id,
        before: existing,
        after: {
          ...updated,
          tenant: existing.tenant,
          feature: existing.feature,
          environment: existing.environment,
        },
      });

      await this.eventEmitter.emitAsync(
        FeatureFlagEventType.UPDATED,
        new FeatureFlagEvent(existing.tenant.name, existing.feature.key, existing.environment),
      );

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

    await this.auditLogService.create({
      action: AuditAction.CREATE,
      resource: 'feature_flag',
      resourceId: created.id,
      before: null,
      after: this.featureFlagMapper.mapToFeatureFlagResponse(created),
    });

    await this.eventEmitter.emitAsync(
      FeatureFlagEventType.CREATED,
      new FeatureFlagEvent(created.tenant.name, created.feature.key, created.environment),
    );

    return this.featureFlagMapper.mapToFeatureFlagResponse(created);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.featureFlagRepository.findById(id);

    const success = await this.featureFlagRepository.delete(id);

    if (success) {
      await this.auditLogService.create({
        action: AuditAction.DELETE,
        resource: 'feature_flag',
        resourceId: deleted.id,
        before: deleted,
        after: null,
      });

      await this.eventEmitter.emitAsync(
        FeatureFlagEventType.DELETED,
        new FeatureFlagEvent(deleted.tenant.name, deleted.feature.key, deleted.environment),
      );
    }

    return success;
  }

  async evaluate(data: EvaluateFeatureFlagDto): Promise<boolean> {
    const { tenant, feature, environment, userId } = data;

    const cacheKey = `feature-flag:${tenant}:${feature}:${environment}`;
    const cached = await this.cacheManager.get<boolean>(cacheKey);

    if (cached !== undefined && cached !== null) {
      return cached;
    }

    const flag = await this.featureFlagRepository.findByTenantNameAndFeatureNameAndEnv(tenant, feature, environment);

    if (!flag || !flag.enabled) {
      await this.cacheManager.set(cacheKey, false, EVALUATE_CACHE_TTL_MS);
      return false;
    }

    const evaluator = FeatureFlagStrategyFactory.getEvaluator(flag.strategy);
    const result = evaluator.evaluate(userId, flag.value ?? {});

    await this.cacheManager.set(cacheKey, result, EVALUATE_CACHE_TTL_MS);
    return result;
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

  async promote(dto: PromoteFeatureFlagsDto): Promise<PromoteFeatureFlagsResponseDto> {
    return this.featureFlagPromoterService.promote(dto);
  }
}
