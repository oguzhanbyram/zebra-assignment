import { Inject, Injectable } from '@nestjs/common';

import { REQUEST_CONTEXT_SERVICE, RequestContextService } from '@common/context';
import { Pageable, Page } from '@common/dto';

import { PaginationUtil } from '@shared/utils';

import { AUDIT_LOG_MAPPER, AUDIT_LOG_REPOSITORY } from '@modules/audit-log/audit-log.constants';
import { CreateAuditLogDto, AuditLogResponseDto, AuditLogFilterDto } from '@modules/audit-log/dto';
import { AuditLogMapper } from '@modules/audit-log/mapper';
import { AuditLogRepository } from '@modules/audit-log/repository';
import { AuditLogService } from '@modules/audit-log/service/audit-log.service';

@Injectable()
export class AuditLogServiceImpl implements AuditLogService {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
    @Inject(AUDIT_LOG_MAPPER)
    private readonly auditLogMapper: AuditLogMapper,
    @Inject(REQUEST_CONTEXT_SERVICE)
    private readonly requestContextService: RequestContextService,
  ) {}

  async create(data: CreateAuditLogDto): Promise<AuditLogResponseDto> {
    const { before, after, ...rest } = data;

    const diff = this.computeDiff(before, after);

    const actor = this.requestContextService.getUser();

    const log = await this.auditLogRepository.create({
      ...rest,
      diff,
      actorId: actor.sub,
      actorName: actor.username,
    });

    return this.auditLogMapper.mapToAuditLogResponse(log);
  }

  async findAll(pageable: Pageable, filter: AuditLogFilterDto): Promise<Page<AuditLogResponseDto>> {
    const page = await this.auditLogRepository.findAll(pageable, filter);

    return PaginationUtil.mapPage(page, log => this.auditLogMapper.mapToAuditLogResponse(log));
  }

  private computeDiff(before?: Record<string, any>, after?: Record<string, any>): Record<string, any> {
    if (!before && after) {
      return { created: after };
    }

    if (before && !after) {
      return { deleted: before };
    }

    if (!before || !after) {
      return {};
    }

    const diff: Record<string, any> = {};

    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      const beforeValue = before[key];
      const afterValue = after[key];

      if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
        diff[key] = { from: beforeValue, to: afterValue };
      }
    }

    return diff;
  }
}
