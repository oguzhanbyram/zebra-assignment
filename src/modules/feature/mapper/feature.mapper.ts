import { FeatureResponseDto } from '@modules/feature/dto';
import { Feature } from '@modules/feature/entity';

export interface FeatureMapper {
  mapToFeatureResponse(entity: Feature): FeatureResponseDto;
  mapToFeatureResponseList(entities: Feature[]): FeatureResponseDto[];
}
