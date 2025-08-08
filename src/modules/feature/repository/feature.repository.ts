import { BaseRepository } from '@shared/repository';

import { Feature } from '@modules/feature/entity';

export interface FeatureRepository extends BaseRepository<Feature> {
  findByKey(key: string): Promise<Feature | null>;
}
