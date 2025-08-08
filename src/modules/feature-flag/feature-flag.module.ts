import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RATE_LIMIT_SERVICE, RateLimitService } from '@common/rate-limit';

import { AuditLogModule } from '@modules/audit-log';
import { FeatureModule } from '@modules/feature/feature.module';
import { FeatureFlag } from '@modules/feature-flag/entity';
import {
  FEATURE_FLAG_MAPPER,
  FEATURE_FLAG_REPOSITORY,
  FEATURE_FLAG_SERVICE,
  FEATURE_FLAG_PROMOTER_SERVICE,
} from '@modules/feature-flag/feature-flag.constants';
import { FeatureFlagController } from '@modules/feature-flag/feature-flag.controller';
import { FeatureFlagMapperImpl } from '@modules/feature-flag/mapper';
import { FeatureFlagRepositoryImpl } from '@modules/feature-flag/repository';
import { FeatureFlagPromoterServiceImpl, FeatureFlagServiceImpl } from '@modules/feature-flag/service';
import { TenantModule } from '@modules/tenant';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureFlag]),
    forwardRef(() => TenantModule),
    forwardRef(() => FeatureModule),
    AuditLogModule,
  ],
  controllers: [FeatureFlagController],
  providers: [
    { provide: RATE_LIMIT_SERVICE, useClass: RateLimitService },
    { provide: FEATURE_FLAG_MAPPER, useClass: FeatureFlagMapperImpl },
    { provide: FEATURE_FLAG_REPOSITORY, useClass: FeatureFlagRepositoryImpl },
    { provide: FEATURE_FLAG_SERVICE, useClass: FeatureFlagServiceImpl },
    { provide: FEATURE_FLAG_PROMOTER_SERVICE, useClass: FeatureFlagPromoterServiceImpl },
  ],
})
export class FeatureFlagModule {}
