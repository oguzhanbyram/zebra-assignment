import { Page, Pageable } from '@common/dto';

import { CreateFeatureDto, FeatureFilterDto, UpdateFeatureDto } from '@modules/feature/dto';
import { Feature } from '@modules/feature/entity';

export interface FeatureService {
  create(data: CreateFeatureDto): Promise<Feature>;
  findAll(pageable: Pageable, filter: FeatureFilterDto): Promise<Page<Feature>>;
  findById(id: string): Promise<Feature>;
  update(id: string, data: UpdateFeatureDto): Promise<Feature>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Feature | null>;
}
