import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeatureModule } from '@modules/feature/feature.module';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { FEATURE_FLAG_SERVICE, FEATURE_FLAG_REPOSITORY } from '@modules/feature-flag/feature-flag.constants';
import { FeatureFlagController } from '@modules/feature-flag/feature-flag.controller';
import { FeatureFlagRepositoryImpl } from '@modules/feature-flag/repository';
import { FeatureFlagServiceImpl } from '@modules/feature-flag/service';
import { TenantModule } from '@modules/tenant';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlag]), forwardRef(() => TenantModule), forwardRef(() => FeatureModule)],
  controllers: [FeatureFlagController],
  providers: [
    {
      provide: FEATURE_FLAG_SERVICE,
      useClass: FeatureFlagServiceImpl,
    },
    {
      provide: FEATURE_FLAG_REPOSITORY,
      useClass: FeatureFlagRepositoryImpl,
    },
  ],
})
export class FeatureFlagModule {}
