import { PlanType, UserRole } from '@common/enum';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  tenantId?: string | null;
  plan?: PlanType;
  iat?: number;
  exp?: number;
}
