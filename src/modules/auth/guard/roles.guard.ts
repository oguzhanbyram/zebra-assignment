import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY, ROLES_KEY } from '@common/decorator';
import { UserRole } from '@common/enum';
import { JwtPayload } from '@common/interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = (req as any).user as JwtPayload | undefined;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`User role "${user.role}" does not have permission to access this resource`);
    }

    return true;
  }
}
