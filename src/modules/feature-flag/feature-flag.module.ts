import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureModule } from '@modules/feature/feature.module';
import { FeatureFlag } from '@modules/feature-flag/entity';
import {
  FEATURE_FLAG_MAPPER,
  FEATURE_FLAG_REPOSITORY,
  FEATURE_FLAG_SERVICE,
} from '@modules/feature-flag/feature-flag.constants';
import { FeatureFlagController } from '@modules/feature-flag/feature-flag.controller';
import { FeatureFlagMapperImpl } from '@modules/feature-flag/mapper';
import { FeatureFlagRepositoryImpl } from '@modules/feature-flag/repository';
import { FeatureFlagServiceImpl } from '@modules/feature-flag/service';
import { TenantModule } from '@modules/tenant';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlag]), forwardRef(() => TenantModule), forwardRef(() => FeatureModule)],
  controllers: [FeatureFlagController],
  providers: [
    { provide: FEATURE_FLAG_MAPPER, useClass: FeatureFlagMapperImpl },
    { provide: FEATURE_FLAG_REPOSITORY, useClass: FeatureFlagRepositoryImpl },
    { provide: FEATURE_FLAG_SERVICE, useClass: FeatureFlagServiceImpl },
  ],
})
export class FeatureFlagModule {}
