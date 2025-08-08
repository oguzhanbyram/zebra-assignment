import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request, Response, NextFunction } from 'express';

import { JwtPayload } from '@common/interface';

import { REQUEST_CONTEXT_SERVICE } from './request-context.constants';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(REQUEST_CONTEXT_SERVICE)
    private readonly context: RequestContextService,
    private readonly jwtService: JwtService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const payload = this.jwtService.decode<JwtPayload>(token) as JwtPayload;

        this.context.setUser(payload);
        this.context.setUserId(payload.sub);
        this.context.setUsername(payload.username);
        this.context.setTenantId(payload.tenantId);
        this.context.setPlan(payload.plan);
        this.context.setRole(payload.role);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    next();
  }
}
