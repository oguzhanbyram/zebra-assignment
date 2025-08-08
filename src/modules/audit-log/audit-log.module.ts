import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AUDIT_LOG_MAPPER, AUDIT_LOG_REPOSITORY, AUDIT_LOG_SERVICE } from '@modules/audit-log/audit-log.constants';
import { AuditLogController } from '@modules/audit-log/audit-log.controller';
import { AuditLog } from '@modules/audit-log/entity';
import { AuditLogMapperImpl } from '@modules/audit-log/mapper';
import { AuditLogRepositoryImpl } from '@modules/audit-log/repository';
import { AuditLogServiceImpl } from '@modules/audit-log/service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [
    { provide: AUDIT_LOG_MAPPER, useClass: AuditLogMapperImpl },
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogRepositoryImpl },
    { provide: AUDIT_LOG_SERVICE, useClass: AuditLogServiceImpl },
  ],
  exports: [AUDIT_LOG_SERVICE],
})
export class AuditLogModule {}
