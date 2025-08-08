import { DataSource } from 'typeorm';

import { Feature } from '../../src/modules/feature/entity';
import { FeatureFlag } from '../../src/modules/feature-flag/entity';
import { Environment, StrategyType } from '../../src/modules/feature-flag/enum';
import { Tenant } from '../../src/modules/tenant/entity';

export async function seedFeatureFlags(
  dataSource: DataSource,
  tenants: Tenant[],
  features: Feature[],
): Promise<FeatureFlag[]> {
  const featureFlagRepo = dataSource.getRepository(FeatureFlag);

  if (!tenants.length || !features.length) {
    console.warn('⚠️  Tenants or Features are missing. Please seed them first.');
    return [];
  }

  const existingFlags = await featureFlagRepo.find();
  if (existingFlags.length > 0) {
    console.log(`🧹 Cleaning existing feature flags...`);
    return [];
  }

  const environments = [Environment.DEV, Environment.STAGING, Environment.PROD];
  const strategies = [StrategyType.BOOLEAN, StrategyType.PERCENTAGE, StrategyType.TARGETING];

  const flags: FeatureFlag[] = [];

  let counter = 0;

  for (const tenant of tenants) {
    for (const feature of features) {
      for (const environment of environments) {
        const strategy = strategies[counter % strategies.length];

        let value: Record<string, any> | null = null;

        switch (strategy) {
          case StrategyType.PERCENTAGE:
            value = { percentage: [10, 25, 50, 75][counter % 4] };
            break;
          case StrategyType.TARGETING:
            value = {
              userIds: [`user_${tenant.name}_a`, `user_${tenant.name}_b`],
            };
            break;
          case StrategyType.BOOLEAN:
          default:
            value = null;
            break;
        }

        const flag = featureFlagRepo.create({
          tenant,
          feature,
          environment,
          enabled: counter % 2 === 0,
          strategy,
          value,
        });

        flags.push(flag);
        counter++;
      }
    }
  }

  await featureFlagRepo.save(flags);
  console.log(`✅ Seeded ${flags.length} feature flags.`);
  return flags;
}
