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

  getRole(): string;
  setRole(role: string): void;
}
