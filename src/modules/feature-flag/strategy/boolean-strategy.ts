import { FeatureFlagStrategyEvaluator } from '@modules/feature-flag/strategy';

export class BooleanStrategyEvaluator implements FeatureFlagStrategyEvaluator {
  evaluate(): boolean {
    return true;
  }
}
