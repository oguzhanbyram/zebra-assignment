import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class Pageable {
  @ApiPropertyOptional({ description: 'Page number (0-based)', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size (max 1000)', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  size?: number;

  @ApiPropertyOptional({ description: 'Sort by field and direction, e.g. name,asc', example: 'name,desc' })
  @IsOptional()
  @IsString()
  sort?: string;
}
