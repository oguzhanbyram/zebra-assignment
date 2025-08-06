import { NotFoundException } from '@nestjs/common';

import { DeepPartial, Repository } from 'typeorm';

import { Page, Pageable } from '@common/dto';
import { EntityFilter } from '@common/filter';

import { BaseRepository } from '@shared/repository';
import { PaginationUtil } from '@shared/utils';

export class BaseRepositoryImpl<T> implements BaseRepository<T> {
  constructor(protected readonly repo: Repository<T>) {}

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll(pageable: Pageable, filter?: EntityFilter<T>): Promise<Page<T>> {
    const qb = this.repo.createQueryBuilder('entity');

    if (filter) {
      filter.apply(qb, 'entity');
    }

    return PaginationUtil.paginate(qb, pageable);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repo.findOne({ where: { id } as any });

    if (!entity) {
      throw new NotFoundException(`${this.repo.metadata.name} with id ${id} not found`);
    }

    return entity;
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
