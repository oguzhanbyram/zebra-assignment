import { ApiProperty } from '@nestjs/swagger';

import { PlanType } from '@common/enum';

export class TenantResponseDto {
  @ApiProperty({ description: 'Name of the tenant', example: 'Test Tenant', maxLength: 50 })
  name: string;

  @ApiProperty({ description: 'Description of the tenant', required: false })
  description?: string;

  @ApiProperty({ type: () => PlanType, enum: PlanType, example: PlanType.FREE })
  plan: PlanType;

  @ApiProperty({ description: 'API key for the tenant', example: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc', required: false })
  apiKey?: string;

  @ApiProperty({ format: 'uuid', example: '8df6a9e2-fb8f-4c93-996a-b37d4bd332a1' })
  id: string;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  updatedAt: Date;
}
