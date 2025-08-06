import { ApiProperty } from '@nestjs/swagger';

export class PageableMeta {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  unpaged: boolean;

  @ApiProperty()
  paged: boolean;
}
