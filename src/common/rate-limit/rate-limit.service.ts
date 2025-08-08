import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { Cache } from 'cache-manager';

import { RATE_LIMIT_WINDOW_SECONDS } from '@common/constant';

export const RATE_LIMIT_SERVICE = 'RATE_LIMIT_SERVICE';

@Injectable()
export class RateLimitService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async isAllowed(key: string, limit: number): Promise<{ allowed: boolean; remaining: number }> {
    const redisKey = `rate_limit:${key}`;

    let count = (await this.cacheManager.get<number>(redisKey)) ?? 0;

    if (count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    count++;

    if (count === 1) {
      await this.cacheManager.set(redisKey, count, RATE_LIMIT_WINDOW_SECONDS * 1000);
    } else {
      await this.cacheManager.set(redisKey, count);
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - count),
    };
  }
}
