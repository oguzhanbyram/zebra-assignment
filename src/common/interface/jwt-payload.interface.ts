import { UserRole } from '@common/enum';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  tenantId?: string | null;
  iat?: number;
  exp?: number;
}
