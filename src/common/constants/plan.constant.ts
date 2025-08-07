export const PLAN_LIMITS: Record<PlanType, { burst: number; sustained: number }> = {
  free: {
    burst: 20,
    sustained: 100,
  },
  basic: {
    burst: 100,
    sustained: 1000,
  },
  pro: {
    burst: 300,
    sustained: 3000,
  },
};

export const PLAN_TYPES = ['free', 'basic', 'pro'] as const;

export type PlanType = (typeof PLAN_TYPES)[number];
