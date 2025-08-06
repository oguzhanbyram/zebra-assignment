import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { PageableMeta, Pageable, SortMeta } from '@common/dto/pagination';

export class Page<T> {
  @ApiHideProperty()
  private readonly _pageable: Pageable;

  constructor(content: T[], totalElements: number, pageable: Pageable) {
    this.content = content;
    this.totalElements = totalElements;
    this._pageable = pageable;
  }

  @ApiProperty({ type: [Object], isArray: true, required: false })
  content: T[];

  @ApiProperty({ type: () => PageableMeta })
  get pageable(): PageableMeta {
    return {
      offset: this._pageable.page * this._pageable.size,
      pageNumber: this._pageable.page,
      pageSize: this._pageable.size,
      paged: true,
      unpaged: false,
    };
  }

  @ApiProperty()
  totalElements: number;

  @ApiProperty()
  get empty(): boolean {
    return this.content.length === 0;
  }

  @ApiProperty()
  get first(): boolean {
    return this._pageable.page === 0;
  }

  @ApiProperty()
  get last(): boolean {
    return this._pageable.page + 1 >= this.totalPages;
  }

  @ApiProperty()
  get number(): number {
    return this._pageable.page;
  }

  @ApiProperty()
  get numberOfElements(): number {
    return this.content.length;
  }

  @ApiProperty()
  get size(): number {
    return this._pageable.size;
  }

  @ApiProperty()
  get sort(): SortMeta {
    const hasSort = !!this._pageable.sort;
    return {
      empty: !hasSort,
      sorted: hasSort,
      unsorted: !hasSort,
    };
  }

  @ApiProperty()
  get totalPages(): number {
    return Math.ceil(this.totalElements / this._pageable.size);
  }

  toJSON() {
    return {
      content: this.content,
      empty: this.empty,
      first: this.first,
      last: this.last,
      number: this.number,
      numberOfElements: this.numberOfElements,
      pageable: this.pageable,
      size: this.size,
      sort: this.sort,
      totalElements: this.totalElements,
      totalPages: this.totalPages,
    };
  }
}
