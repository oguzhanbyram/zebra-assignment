import { SelectQueryBuilder } from 'typeorm';

import { Pageable, Page } from '@common/dto';

export class PaginationUtil {
  private static readonly DEFAULT_PAGE = 0;
  private static readonly DEFAULT_SIZE = 10;
  private static readonly MAX_SIZE = 100;

  static async paginate<T>(qb: SelectQueryBuilder<T>, pageable: Pageable): Promise<Page<T>> {
    const normalized = this.normalizePageable(pageable);

    this.applySorting(qb, normalized.sort);

    const [content, totalElements] = await qb
      .skip(normalized.page * normalized.size)
      .take(normalized.size)
      .getManyAndCount();

    return new Page<T>(content, totalElements, pageable);
  }

  private static normalizePageable(pageable: Pageable): Required<Pageable> {
    const page = isNaN(pageable.page) ? this.DEFAULT_PAGE : Math.max(0, pageable.page);
    const size = isNaN(pageable.size) ? this.DEFAULT_SIZE : Math.min(this.MAX_SIZE, Math.max(1, pageable.size));
    const sort = (pageable.sort ?? '').trim();

    return { page, size, sort };
  }

  private static applySorting<T>(qb: SelectQueryBuilder<T>, sort: string): void {
    if (!sort) return;
    const [field, dir] = sort.split(',').map(s => s.trim());
    if (!field) return;
    const direction = dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy(`${qb.alias}.${field}`, direction);
  }

  static mapPage<T, U>(page: Page<T>, mapperFn: (entity: T) => U): Page<U> {
    return new Page<U>(page.content.map(mapperFn), page.totalElements, page._pageable);
  }
}
