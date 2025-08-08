import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';

import { PLAN_LIMITS } from '@common/constant';
import { JwtPayload } from '@common/interface';

import { RATE_LIMIT_SERVICE, RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    @Inject(RATE_LIMIT_SERVICE)
    private readonly rateLimitService: RateLimitService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const user: JwtPayload = req.user;

    if (!user?.tenantId || !user?.plan) return next.handle();

    const { tenantId, plan } = user;
    const limits = PLAN_LIMITS[plan];

    const cacheKey = `rate_limit:${tenantId}`;
    const { allowed, remaining } = await this.rateLimitService.isAllowed(cacheKey, limits.burst);

    res.setHeader('X-RateLimit-Limit', limits.burst);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      throw new TooManyRequestsException('Rate limit exceeded. Please try again later.');
    }

    return next.handle();
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, 429);
  }
}
