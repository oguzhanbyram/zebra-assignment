export interface FeatureFlagStrategyEvaluator {
  evaluate(userId: string | undefined, value: Record<string, any>): boolean;
}
