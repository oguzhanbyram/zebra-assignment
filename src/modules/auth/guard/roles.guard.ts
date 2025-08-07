import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { ROLES_KEY } from '@common/decorator';
import { UserRole } from '@common/enum';

import { AuthGuard } from '@modules/auth/guard/auth.guard';

@Injectable()
export class RolesGuard extends AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    protected jwtService: JwtService,
    protected configService: ConfigService,
  ) {
    super(jwtService, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const canActivateBase = await super.canActivate(context);
    if (!canActivateBase) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`User role ${user.role} does not have permission to access this resource`);
    }

    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);
  }
}
