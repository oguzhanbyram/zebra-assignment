import { Pageable, Page } from '@common/dto';

import { CreateAuditLogDto, AuditLogResponseDto, AuditLogFilterDto } from '@modules/audit-log/dto';

export interface AuditLogService {
  create(data: CreateAuditLogDto): Promise<AuditLogResponseDto>;
  findAll(pageable: Pageable, filter: AuditLogFilterDto): Promise<Page<AuditLogResponseDto>>;
}
