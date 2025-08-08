import { ApiProperty } from '@nestjs/swagger';

export class PromoteFeatureFlagsResponseDto {
  @ApiProperty({ example: 5, description: 'Number of feature flags created in the target environment' })
  created: number;

  @ApiProperty({ example: 3, description: 'Number of existing feature flags updated in the target environment' })
  updated: number;
}
