import { Injectable } from '@nestjs/common';

import { FeatureFlagResponseDto } from '@modules/feature-flag/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { FeatureFlagMapper } from '@modules/feature-flag/mapper/feature-flag.mapper';

@Injectable()
export class FeatureFlagMapperImpl implements FeatureFlagMapper {
  mapToFeatureFlagResponse(flag: FeatureFlag): FeatureFlagResponseDto {
    const { id, tenantId, tenant, featureId, feature, environment, enabled, strategy, value } = flag;

    return {
      id,
      tenantId,
      tenantName: tenant.name,
      featureId,
      featureKey: feature.key,
      environment,
      enabled,
      strategy,
      value,
    };
  }

  mapToFeatureFlagResponseList(flags: FeatureFlag[]): FeatureFlagResponseDto[] {
    return flags.map(flag => this.mapToFeatureFlagResponse(flag));
  }
}
