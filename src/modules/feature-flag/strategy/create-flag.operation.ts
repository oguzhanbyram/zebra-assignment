import { AuditAction } from '@common/enum';

import { CreateAuditLogDto } from '@modules/audit-log/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { Environment } from '@modules/feature-flag/enum';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FlagPromotionOperation } from '@modules/feature-flag/strategy';

export class CreateFlagOperation implements FlagPromotionOperation {
  constructor(
    private readonly source: FeatureFlag,
    private readonly tenantId: string,
    private readonly targetEnv: string,
  ) {}

  hasChanges(): boolean {
    return true;
  }

  async execute(repo: FeatureFlagRepository): Promise<FeatureFlag> {
    return repo.create({
      tenant: { id: this.tenantId },
      feature: { id: this.source.feature.id },
      environment: Environment[this.targetEnv],
      enabled: this.source.enabled,
      strategy: this.source.strategy,
      value: this.source.value,
    });
  }

  buildAuditLog(result: FeatureFlag): CreateAuditLogDto {
    return {
      action: AuditAction.CREATE,
      resource: 'feature_flag',
      resourceId: result.id,
      before: null,
      after: result,
    };
  }
}
