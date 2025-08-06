import { Inject, Injectable } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { CreateFeatureDto, FeatureFilterDto, UpdateFeatureDto } from '@modules/feature/dto';
import { Feature } from '@modules/feature/entity';
import { FEATURE_REPOSITORY } from '@modules/feature/feature.constants';
import { FeatureRepository } from '@modules/feature/repository';
import { FeatureService } from '@modules/feature/service/feature.service';

@Injectable()
export class FeatureServiceImpl implements FeatureService {
  constructor(
    @Inject(FEATURE_REPOSITORY)
    private readonly featureRepository: FeatureRepository,
  ) {}

  create(data: CreateFeatureDto): Promise<Feature> {
    return this.featureRepository.create(data);
  }

  findAll(pageable: Pageable, filter: FeatureFilterDto): Promise<Page<Feature>> {
    return this.featureRepository.findAll(pageable, filter);
  }

  findById(id: string): Promise<Feature> {
    return this.featureRepository.findById(id);
  }

  update(id: string, data: UpdateFeatureDto): Promise<Feature> {
    return this.featureRepository.update(id, data);
  }

  delete(id: string): Promise<boolean> {
    return this.featureRepository.delete(id);
  }

  findByName(name: string): Promise<Feature | null> {
    return this.featureRepository.findByName(name);
  }
}
