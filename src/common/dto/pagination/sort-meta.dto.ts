import { ApiProperty } from '@nestjs/swagger';

export class SortMeta {
  @ApiProperty()
  empty: boolean;

  @ApiProperty()
  sorted: boolean;

  @ApiProperty()
  unsorted: boolean;
}
