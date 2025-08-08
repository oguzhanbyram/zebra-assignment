import { Injectable } from '@nestjs/common';

import { AuditLogResponseDto } from '@modules/audit-log/dto';
import { AuditLog } from '@modules/audit-log/entity';

import { AuditLogMapper } from './audit-log.mapper';

@Injectable()
export class AuditLogMapperImpl implements AuditLogMapper {
  mapToAuditLogResponse(log: AuditLog): AuditLogResponseDto {
    return log;
  }

  mapToAuditLogResponseList(logs: AuditLog[]): AuditLogResponseDto[] {
    return logs.map(log => this.mapToAuditLogResponse(log));
  }
}
