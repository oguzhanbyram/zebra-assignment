import { AuditLogModule } from './audit-log';
import { AuthModule } from './auth';
import { FeatureModule } from './feature';
import { FeatureFlagModule } from './feature-flag';
import { TenantModule } from './tenant';
import { UserModule } from './user';

export const modules = [AuditLogModule, AuthModule, FeatureModule, FeatureFlagModule, TenantModule, UserModule];
