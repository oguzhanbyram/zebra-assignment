import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Cache } from 'cache-manager';

import { FeatureFlagEventType } from '@modules/feature-flag/enum';
import { FeatureFlagEvent } from '@modules/feature-flag/event';

export class FeatureFlagListener {
  private readonly logger = new Logger(FeatureFlagListener.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @OnEvent(FeatureFlagEventType.UPDATED)
  @OnEvent(FeatureFlagEventType.CREATED)
  @OnEvent(FeatureFlagEventType.DELETED)
  @OnEvent(FeatureFlagEventType.PROMOTED)
  async handleCacheInvalidation(event: FeatureFlagEvent): Promise<void> {
    const { tenant, feature, environment } = event;

    const cacheKey = `feature-flag:${tenant}:${feature}:${environment}`;
    this.logger.log(`Invalidating cache for key: ${cacheKey}`);

    try {
      await this.cacheManager.del(cacheKey);
      this.logger.log(`Cache invalidated for key: ${cacheKey}`);
    } catch (error) {
      this.logger.error(`Failed to invalidate cache for key: ${cacheKey}`, error);
    }
  }
}
