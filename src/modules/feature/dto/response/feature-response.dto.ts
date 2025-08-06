import { ApiProperty } from '@nestjs/swagger';

export class FeatureResponseDto {
  @ApiProperty({ description: 'Name of the feature', example: 'Test Feature', maxLength: 50 })
  name: string;

  @ApiProperty({ description: 'Description of the feature', required: false })
  description?: string;

  @ApiProperty({ format: 'uuid', example: '8df6a9e2-fb8f-4c93-996a-b37d4bd332a1' })
  id: string;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  updatedAt: Date;
}
