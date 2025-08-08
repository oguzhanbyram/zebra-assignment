import { AuditAction } from '@common/enum';

import { CreateAuditLogDto } from '@modules/audit-log/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';
import { FlagPromotionOperation } from '@modules/feature-flag/strategy';

export class UpdateFlagOperation implements FlagPromotionOperation {
  constructor(
    private readonly source: FeatureFlag,
    private readonly target: FeatureFlag,
  ) {}

  hasChanges(): boolean {
    return (
      this.source.enabled !== this.target.enabled ||
      this.source.strategy !== this.target.strategy ||
      JSON.stringify(this.source.value) !== JSON.stringify(this.target.value)
    );
  }

  async execute(repo: FeatureFlagRepository): Promise<FeatureFlag> {
    return repo.update(this.target.id, {
      enabled: this.source.enabled,
      strategy: this.source.strategy,
      value: this.source.value,
    });
  }

  buildAuditLog(result: FeatureFlag): CreateAuditLogDto {
    return {
      action: AuditAction.UPDATE,
      resource: 'feature_flag',
      resourceId: this.target.id,
      before: this.target,
      after: {
        ...result,
        tenant: this.target.tenant,
        feature: this.target.feature,
        environment: this.target.environment,
      },
    };
  }
}
