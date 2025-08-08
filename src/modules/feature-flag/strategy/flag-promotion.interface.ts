import { CreateAuditLogDto } from '@modules/audit-log/dto';
import { FeatureFlag } from '@modules/feature-flag/entity';
import { FeatureFlagRepository } from '@modules/feature-flag/repository';

export interface FlagPromotionOperation {
  hasChanges(): boolean;
  execute(repo: FeatureFlagRepository): Promise<FeatureFlag>;
  buildAuditLog(result: FeatureFlag): CreateAuditLogDto;
}
