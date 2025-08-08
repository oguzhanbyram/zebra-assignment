import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { AuditAction } from '@common/enum';
import { EntityFilter } from '@common/filter';

import { AuditLog } from '@modules/audit-log/entity';

export class AuditLogFilterDto implements EntityFilter<AuditLog> {
  @ApiPropertyOptional({ description: 'Filter by resource name (ILIKE)' })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiPropertyOptional({ description: 'Filter by actor ID (UUID)' })
  @IsOptional()
  @IsUUID()
  actorId?: string;

  @ApiPropertyOptional({ description: 'Filter by actor name (ILIKE)' })
  @IsOptional()
  @IsString()
  actorName?: string;

  @ApiPropertyOptional({
    type: () => AuditAction,
    enum: AuditAction,
    description: 'Filter by action type',
    example: AuditAction.UPDATE,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  apply(qb: SelectQueryBuilder<AuditLog>, alias = 'audit'): SelectQueryBuilder<AuditLog> {
    if (this.resource) {
      qb.andWhere(`${alias}.resource ILIKE :resource`, { resource: `%${this.resource}%` });
    }

    if (this.actorId) {
      qb.andWhere(`${alias}.actorId = :actorId`, { actorId: this.actorId });
    }

    if (this.actorName) {
      qb.andWhere(`${alias}.actorName ILIKE :actorName`, { actorName: `%${this.actorName}%` });
    }

    if (this.action) {
      qb.andWhere(`${alias}.action = :action`, { action: this.action });
    }

    return qb;
  }
}
