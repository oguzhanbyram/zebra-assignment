import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly entitiesPath: string;
  private readonly subscribersPath: string;

  constructor(private readonly configService: ConfigService) {
    this.entitiesPath = path.join(__dirname, '../../**/*.entity{.ts,.js}');
    this.subscribersPath = path.join(__dirname, '../../**/*.subscriber{.ts,.js}');
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST') || 'localhost',
      port: +this.configService.get('DB_PORT') || 5432,
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [this.entitiesPath],
      subscribers: [this.subscribersPath],
      autoLoadEntities: true,
      synchronize: false,
      logging: this.configService.get('NODE_ENV') === 'development',
      logger: 'advanced-console',
    };
  }
}
