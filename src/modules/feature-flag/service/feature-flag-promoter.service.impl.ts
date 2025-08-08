import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { AUDIT_LOG_SERVICE, AuditLogService } from '@modules/audit-log';
import { PromoteFeatureFlagsDto, PromoteFeatureFlagsResponseDto } from '@modules/feature-flag/dto';
import { FEATURE_FLAG_REPOSITORY } from '@modules/feature-flag/feature-flag.constants';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FeatureFlagPromoterService } from '@modules/feature-flag/service';
import { UpdateFlagOperation, CreateFlagOperation } from '@modules/feature-flag/strategy';
import { TENANT_SERVICE, TenantService } from '@modules/tenant';

@Injectable()
export class FeatureFlagPromoterServiceImpl implements FeatureFlagPromoterService {
  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY)
    private readonly repository: FeatureFlagRepository,
    @Inject(TENANT_SERVICE)
    private readonly tenantService: TenantService,
    @Inject(AUDIT_LOG_SERVICE)
    private readonly auditLogService: AuditLogService,
  ) {}

  async promote(dto: PromoteFeatureFlagsDto): Promise<PromoteFeatureFlagsResponseDto> {
    const { tenantId, sourceEnv, targetEnv, dryRun } = dto;

    if (sourceEnv === targetEnv) {
      throw new BadRequestException('sourceEnv and targetEnv cannot be the same');
    }

    await this.tenantService.findById(tenantId);

    const [sourceFlags, targetFlags] = await Promise.all([
      this.repository.findByTenantAndEnvironment(tenantId, sourceEnv),
      this.repository.findByTenantAndEnvironment(tenantId, targetEnv),
    ]);

    const targetMap = new Map(targetFlags.map(f => [f.feature.id, f]));

    let created = 0;
    let updated = 0;

    for (const source of sourceFlags) {
      const target = targetMap.get(source.feature.id);

      const operation = target
        ? new UpdateFlagOperation(source, target)
        : new CreateFlagOperation(source, tenantId, targetEnv);

      if (!operation.hasChanges()) {
        continue;
      }

      if (!dryRun) {
        const result = await operation.execute(this.repository);
        await this.auditLogService.create(operation.buildAuditLog(result));
      }

      if (operation instanceof CreateFlagOperation) {
        created++;
      } else {
        updated++;
      }
    }

    return { created, updated };
  }
}
