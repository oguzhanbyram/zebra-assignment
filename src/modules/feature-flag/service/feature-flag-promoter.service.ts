import { PromoteFeatureFlagsDto, PromoteFeatureFlagsResponseDto } from '@modules/feature-flag/dto';

export interface FeatureFlagPromoterService {
  promote(dto: PromoteFeatureFlagsDto): Promise<PromoteFeatureFlagsResponseDto>;
}
