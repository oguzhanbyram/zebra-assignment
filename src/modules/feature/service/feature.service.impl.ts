import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { PaginationUtil } from '@shared/utils';

import { CreateFeatureDto, FeatureFilterDto, FeatureResponseDto, UpdateFeatureDto } from '@modules/feature/dto';
import { FEATURE_MAPPER, FEATURE_REPOSITORY } from '@modules/feature/feature.constants';
import { FeatureMapper } from '@modules/feature/mapper';
import { FeatureRepository } from '@modules/feature/repository';
import { FeatureService } from '@modules/feature/service/feature.service';

@Injectable()
export class FeatureServiceImpl implements FeatureService {
  constructor(
    @Inject(FEATURE_REPOSITORY)
    private readonly featureRepository: FeatureRepository,
    @Inject(FEATURE_MAPPER)
    private readonly featureMapper: FeatureMapper,
  ) {}

  async create(data: CreateFeatureDto): Promise<FeatureResponseDto> {
    const existing = await this.featureRepository.findByKey(data.key);

    if (existing) {
      throw new ConflictException(`Feature with key "${data.key}" already exists`);
    }

    const feature = await this.featureRepository.create(data);

    return this.featureMapper.mapToFeatureResponse(feature);
  }

  async findAll(pageable: Pageable, filter: FeatureFilterDto): Promise<Page<FeatureResponseDto>> {
    const page = await this.featureRepository.findAll(pageable, filter);

    return PaginationUtil.mapPage(page, feature => this.featureMapper.mapToFeatureResponse(feature));
  }

  async findById(id: string): Promise<FeatureResponseDto> {
    const feature = await this.featureRepository.findById(id);

    return this.featureMapper.mapToFeatureResponse(feature);
  }

  async update(id: string, data: UpdateFeatureDto): Promise<FeatureResponseDto> {
    await this.featureRepository.findById(id);

    const updated = await this.featureRepository.update(id, data);

    return this.featureMapper.mapToFeatureResponse(updated);
  }

  delete(id: string): Promise<boolean> {
    return this.featureRepository.delete(id);
  }

  async findByKey(key: string): Promise<FeatureResponseDto> {
    const feature = await this.featureRepository.findByKey(key);

    if (!feature) {
      throw new NotFoundException(`Feature with key "${key}" not found`);
    }

    return this.featureMapper.mapToFeatureResponse(feature);
  }
}
