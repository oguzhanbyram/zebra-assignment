import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'dark_mode', description: 'Unique key for the feature' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Dark Mode', description: 'Human-readable name of the feature' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Enables dark mode in the application', required: false })
  @IsString()
  description?: string;
}
