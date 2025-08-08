import { FeatureFlagResponseDto } from '@modules/feature-flag/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';

export interface FeatureFlagMapper {
  mapToFeatureFlagResponse(flag: FeatureFlag): FeatureFlagResponseDto;
  mapToFeatureFlagResponseList(flags: FeatureFlag[]): FeatureFlagResponseDto[];
}
