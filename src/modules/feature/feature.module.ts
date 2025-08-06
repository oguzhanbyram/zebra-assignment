import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Feature } from '@modules/feature/entity';
import { FEATURE_SERVICE, FEATURE_REPOSITORY } from '@modules/feature/feature.constants';
import { FeatureController } from '@modules/feature/feature.controller';
import { FeatureRepositoryImpl } from '@modules/feature/repository';
import { FeatureServiceImpl } from '@modules/feature/service';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeatureController],
  providers: [
    {
      provide: FEATURE_SERVICE,
      useClass: FeatureServiceImpl,
    },
    {
      provide: FEATURE_REPOSITORY,
      useClass: FeatureRepositoryImpl,
    },
  ],
  exports: [FEATURE_SERVICE],
})
export class FeatureModule {}
