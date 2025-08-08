import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@shared/repository';

import { AuditLog } from '@modules/audit-log/entity';
import { AuditLogRepository } from '@modules/audit-log/repository/audit-log.repository';

@Injectable()
export class AuditLogRepositoryImpl extends BaseRepositoryImpl<AuditLog> implements AuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    repo: Repository<AuditLog>,
  ) {
    super(repo);
  }
}
