import { BadRequestException } from '@nestjs/common';

import { FeatureFlagStrategyEvaluator } from '@modules/feature-flag/strategy';

export class PercentageStrategyEvaluator implements FeatureFlagStrategyEvaluator {
  evaluate(userId: string | undefined, value: Record<string, any>): boolean {
    if (!userId) {
      throw new BadRequestException('userId is required for PERCENTAGE strategy');
    }

    const percentage = value?.percentage;
    if (typeof percentage !== 'number' || percentage <= 0 || percentage > 100) return false;

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash) % 100 < percentage;
  }
}
