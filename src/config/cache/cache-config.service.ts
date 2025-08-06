import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    if (this.configService.get('REDIS_ENABLED') === 'false') {
      return {};
    }

    const redis = new KeyvRedis(this.configService.get<string>('REDIS_URL'));

    const keyv = new Keyv({
      store: redis,
      namespace: undefined,
      useKeyPrefix: false,
    });

    return { stores: keyv };
  }
}
