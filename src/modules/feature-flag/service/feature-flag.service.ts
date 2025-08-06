import { Page, Pageable } from '@common/dto';

import { UpsertFeatureFlagDto, FeatureFlagFilterDto, EvaluateFeatureFlagDto } from '@modules/feature-flag/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';

export interface FeatureFlagService {
  upsert(data: UpsertFeatureFlagDto): Promise<FeatureFlag>;
  findAll(pageable: Pageable, filter: FeatureFlagFilterDto): Promise<Page<FeatureFlag>>;
  delete(id: string): Promise<boolean>;
  evaluate(dto: EvaluateFeatureFlagDto): Promise<boolean>;
}
