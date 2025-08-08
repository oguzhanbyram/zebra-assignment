import { Injectable, Scope } from '@nestjs/common';

import { PlanType, UserRole } from '@common/enum';
import { JwtPayload } from '@common/interface';

import { RequestContextService } from './request-context.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextServiceImpl implements RequestContextService {
  private user?: JwtPayload;

  getUser(): JwtPayload {
    return this.user;
  }

  setUser(user: JwtPayload): void {
    this.user = user;
  }

  getUsername(): string {
    return this.user?.username;
  }

  setUsername(username: string): void {
    this.user.username = username;
  }

  getUserId(): string {
    return this.user?.sub;
  }

  setUserId(userId: string): void {
    this.user.sub = userId;
  }

  getTenantId(): string {
    return this.user?.tenantId;
  }

  setTenantId(tenantId: string): void {
    this.user.tenantId = tenantId;
  }

  getPlan(): PlanType {
    return this.user?.plan;
  }

  setPlan(plan: PlanType): void {
    this.user.plan = plan;
  }

  getRole(): string {
    return this.user?.role;
  }

  setRole(role: UserRole): void {
    this.user.role = role;
  }
}
