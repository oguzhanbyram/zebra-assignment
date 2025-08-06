import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { slugger } from '@shared/utils';

export class CreateFeatureDto {
  @ApiProperty({ example: 'My Feature', required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => slugger(value))
  name: string;

  @ApiProperty({ example: 'This is a description of my feature.', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
