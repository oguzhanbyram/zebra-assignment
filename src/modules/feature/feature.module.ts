import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Feature } from '@modules/feature/entity';
import { FEATURE_MAPPER, FEATURE_REPOSITORY, FEATURE_SERVICE } from '@modules/feature/feature.constants';
import { FeatureController } from '@modules/feature/feature.controller';
import { FeatureMapperImpl } from '@modules/feature/mapper';
import { FeatureRepositoryImpl } from '@modules/feature/repository';
import { FeatureServiceImpl } from '@modules/feature/service';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeatureController],
  providers: [
    { provide: FEATURE_MAPPER, useClass: FeatureMapperImpl },
    { provide: FEATURE_REPOSITORY, useClass: FeatureRepositoryImpl },
    { provide: FEATURE_SERVICE, useClass: FeatureServiceImpl },
  ],
  exports: [FEATURE_SERVICE],
})
export class FeatureModule {}
