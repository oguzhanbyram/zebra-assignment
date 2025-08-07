import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CacheConfigModule } from '@config/cache';
import { TypeOrmConfigModule } from '@config/data-sources';
import { LoggerConfigModule } from '@config/logger';

import { modules } from '@modules/index';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheConfigModule,
    TypeOrmConfigModule,
    LoggerConfigModule,
    ...modules,
  ],
})
export class AppModule {}
