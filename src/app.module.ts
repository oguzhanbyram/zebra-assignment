import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { RequestContextModule } from '@common/context';
import { MetricsModule } from '@common/metrics/metrics.module';

import { CacheConfigModule } from '@config/cache';
import { TypeOrmConfigModule } from '@config/data-sources';
import { LoggerConfigModule } from '@config/logger';

import { AuthGuard, RolesGuard } from '@modules/auth';
import { modules } from '@modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    EventEmitterModule.forRoot(),
    CacheConfigModule,
    TypeOrmConfigModule,
    LoggerConfigModule,
    RequestContextModule,
    MetricsModule,
    ...modules,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
