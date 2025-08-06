import { DeepPartial } from 'typeorm';

import { Page, Pageable } from '@common/dto';
import { EntityFilter } from '@common/filter';

export interface BaseRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findAll(pageable: Pageable, filter?: EntityFilter<T>): Promise<Page<T>>;
  findById(id: string): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
