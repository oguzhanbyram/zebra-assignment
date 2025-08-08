import { Injectable } from '@nestjs/common';

import { FeatureResponseDto } from '@modules/feature/dto';
import { Feature } from '@modules/feature/entity';
import { FeatureMapper } from '@modules/feature/mapper';

@Injectable()
export class FeatureMapperImpl implements FeatureMapper {
  mapToFeatureResponse(feature: Feature): FeatureResponseDto {
    const { id, key, name, description, createdAt, updatedAt } = feature;

    return {
      id,
      key,
      name,
      description: description ?? null,
      createdAt,
      updatedAt,
    };
  }

  mapToFeatureResponseList(features: Feature[]): FeatureResponseDto[] {
    return features.map(feature => this.mapToFeatureResponse(feature));
  }
}
