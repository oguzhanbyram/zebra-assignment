import { BaseRepository } from '@shared/repository';

import { AuditLog } from '@modules/audit-log/entity';

export interface AuditLogRepository extends BaseRepository<AuditLog> {}
