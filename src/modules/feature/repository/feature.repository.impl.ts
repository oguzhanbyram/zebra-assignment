import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@shared/repository';

import { Feature } from '@modules/feature/entity';
import { FeatureRepository } from '@modules/feature/repository/feature.repository';

@Injectable()
export class FeatureRepositoryImpl extends BaseRepositoryImpl<Feature> implements FeatureRepository {
  constructor(
    @InjectRepository(Feature)
    repo: Repository<Feature>,
  ) {
    super(repo);
  }

  findByName(name: string): Promise<Feature | null> {
    return this.repo.createQueryBuilder('feature').where('feature.name = :name', { name }).getOne();
  }
}
