import { StrategyType } from '@modules/feature-flag/enum';
import {
  BooleanStrategyEvaluator,
  FeatureFlagStrategyEvaluator,
  PercentageStrategyEvaluator,
  TargetingStrategyEvaluator,
} from '@modules/feature-flag/strategy';

export class FeatureFlagStrategyFactory {
  static getEvaluator(strategy: StrategyType): FeatureFlagStrategyEvaluator {
    switch (strategy) {
      case StrategyType.BOOLEAN:
        return new BooleanStrategyEvaluator();
      case StrategyType.PERCENTAGE:
        return new PercentageStrategyEvaluator();
      case StrategyType.TARGETING:
        return new TargetingStrategyEvaluator();
      default:
        throw new Error(`Unsupported strategy: ${strategy}`);
    }
  }
}
