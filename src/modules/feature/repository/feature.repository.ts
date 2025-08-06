import { BaseRepository } from '@shared/repository';

import { Feature } from '@modules/feature/entity';

export interface FeatureRepository extends BaseRepository<Feature> {
  findByName(name: string): Promise<Feature | null>;
}
