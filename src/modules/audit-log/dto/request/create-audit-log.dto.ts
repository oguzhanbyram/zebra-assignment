import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { AuditAction } from '@common/enum';

export class CreateAuditLogDto {
  @IsEnum(AuditAction)
  action: AuditAction;

  @IsString()
  resource: string;

  @IsUUID()
  resourceId: string;

  @IsOptional()
  before?: Record<string, any>;

  @IsOptional()
  after?: Record<string, any>;
}
