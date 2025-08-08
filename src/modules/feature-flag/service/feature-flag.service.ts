import { Page, Pageable } from '@common/dto';

import {
  UpsertFeatureFlagDto,
  FeatureFlagFilterDto,
  EvaluateFeatureFlagDto,
  FeatureFlagResponseDto,
} from '@modules/feature-flag/dto';

export interface FeatureFlagService {
  upsert(data: UpsertFeatureFlagDto): Promise<FeatureFlagResponseDto>;
  findAll(pageable: Pageable, filter: FeatureFlagFilterDto): Promise<Page<FeatureFlagResponseDto>>;
  delete(id: string): Promise<boolean>;
  evaluate(data: EvaluateFeatureFlagDto): Promise<boolean>;
}
