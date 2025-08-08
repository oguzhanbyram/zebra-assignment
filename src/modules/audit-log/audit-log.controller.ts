import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginatedResponse, Roles } from '@common/decorator';
import { Page, Pageable } from '@common/dto';
import { UserRole } from '@common/enum';

import { AUDIT_LOG_SERVICE } from '@modules/audit-log/audit-log.constants';
import { AuditLogFilterDto, AuditLogResponseDto } from '@modules/audit-log/dto';
import { AuditLogService } from '@modules/audit-log/service';

@ApiTags('audit-log-controller')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('audit-logs')
export class AuditLogController {
  constructor(
    @Inject(AUDIT_LOG_SERVICE)
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs with filtering and pagination' })
  @PaginatedResponse(AuditLogResponseDto)
  findAll(@Query() pageable: Pageable, @Query() filter: AuditLogFilterDto): Promise<Page<AuditLogResponseDto>> {
    return this.auditLogService.findAll(pageable, filter);
  }
}
