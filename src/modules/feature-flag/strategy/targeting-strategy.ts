import { BadRequestException } from '@nestjs/common';

import { FeatureFlagStrategyEvaluator } from '@modules/feature-flag/strategy';

export class TargetingStrategyEvaluator implements FeatureFlagStrategyEvaluator {
  evaluate(userId: string | undefined, value: Record<string, any>): boolean {
    if (!userId) {
      throw new BadRequestException('userId is required for TARGETING strategy');
    }

    const userIds = value?.userIds;
    if (!Array.isArray(userIds)) return false;

    return userIds.includes(userId);
  }
}
