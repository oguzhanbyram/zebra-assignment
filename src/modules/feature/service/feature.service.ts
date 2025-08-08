import { Page, Pageable } from '@common/dto';

import { CreateFeatureDto, FeatureFilterDto, FeatureResponseDto, UpdateFeatureDto } from '@modules/feature/dto';

export interface FeatureService {
  create(data: CreateFeatureDto): Promise<FeatureResponseDto>;
  findAll(pageable: Pageable, filter: FeatureFilterDto): Promise<Page<FeatureResponseDto>>;
  findById(id: string): Promise<FeatureResponseDto>;
  update(id: string, data: UpdateFeatureDto): Promise<FeatureResponseDto>;
  delete(id: string): Promise<boolean>;
  findByKey(key: string): Promise<FeatureResponseDto | null>;
}
