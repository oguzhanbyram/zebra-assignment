import { PlanType } from '@common/enum';

export const PLAN_LIMITS: Record<PlanType, { burst: number; sustained: number }> = {
  [PlanType.FREE]: {
    burst: 20,
    sustained: 100,
  },
  [PlanType.BASIC]: {
    burst: 100,
    sustained: 1000,
  },
  [PlanType.PRO]: {
    burst: 300,
    sustained: 3000,
  },
};

export const RATE_LIMIT_WINDOW_SECONDS = 60;
