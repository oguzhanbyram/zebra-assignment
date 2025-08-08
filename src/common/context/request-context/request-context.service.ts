import { PlanType } from '@common/enum';
import { JwtPayload } from '@common/interface';

export interface RequestContextService {
  getUser(): JwtPayload;
  setUser(user: JwtPayload): void;

  getUsername(): string;
  setUsername(username: string): void;

  getUserId(): string;
  setUserId(userId: string): void;

  getTenantId(): string;
  setTenantId(tenantId: string): void;

  getPlan(): PlanType;
  setPlan(plan: PlanType): void;

  getRole(): string;
  setRole(role: string): void;
}
