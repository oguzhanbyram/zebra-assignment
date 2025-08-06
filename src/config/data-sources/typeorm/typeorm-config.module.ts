import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async options => {
        if (!options) {
          throw new Error('TypeORM options are not defined');
        }

        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class TypeOrmConfigModule {}
