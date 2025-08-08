import { AuditLogResponseDto } from '@modules/audit-log/dto';
import { AuditLog } from '@modules/audit-log/entity';

export interface AuditLogMapper {
  mapToAuditLogResponse(log: AuditLog): AuditLogResponseDto;
  mapToAuditLogResponseList(logs: AuditLog[]): AuditLogResponseDto[];
}
