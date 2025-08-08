import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AuditAction } from '@common/enum';

export class AuditLogResponseDto {
  @ApiProperty({ type: () => AuditAction, enum: AuditAction, example: AuditAction.UPDATE })
  action: AuditAction;

  @ApiProperty({ example: 'feature_flag' })
  resource: string;

  @ApiProperty({ type: String, format: 'uuid', example: 'c5a5c7f3-fdee-4bc1-bd4a-09a1f1aa5ea1' })
  resourceId: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  actorId?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  actorName?: string;

  @ApiPropertyOptional({ type: Object })
  diff?: Record<string, { from: any; to: any }>;

  @ApiProperty({ format: 'uuid', example: '8df6a9e2-fb8f-4c93-996a-b37d4bd332a1' })
  id: string;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time', example: '2025-05-15T14:45:00.000Z' })
  updatedAt: Date;
}
