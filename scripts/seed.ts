import { NestFactory } from '@nestjs/core';

import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { UserRole } from '@common/enum';

import { AppModule } from '../src/app.module';
import { Feature } from '../src/modules/feature/entity';
import { FeatureFlag } from '../src/modules/feature-flag/entity';
import { Environment, StrategyType } from '../src/modules/feature-flag/enum';
import { Tenant } from '../src/modules/tenant/entity';
import { User } from '../src/modules/user/entity';

async function createUsers(dataSource: DataSource): Promise<void> {
  const tenantRepo = dataSource.getRepository(Tenant);
  const tenant1 = await tenantRepo.findOneByOrFail({ name: 'zebra' });
  const tenant2 = await tenantRepo.findOneByOrFail({ name: 'globex' });

  const userData = [
    {
      username: 'admin',
      password: 'admin123',
      role: UserRole.ADMIN,
      tenant: null,
    },
    {
      username: 'zebra',
      password: 'zebra123',
      role: UserRole.TENANT,
      tenant: tenant1,
    },
    {
      username: 'globex',
      password: 'globex123',
      role: UserRole.TENANT,
      tenant: tenant2,
    },
  ];

  const users = await Promise.all(
    userData.map(async data =>
      dataSource.manager.create(User, {
        username: data.username,
        password: await bcrypt.hash(data.password, 10),
        role: data.role,
        tenant: data.tenant,
      }),
    ),
  );

  await dataSource.manager.save(users);
}

async function createTenants(dataSource: DataSource): Promise<Tenant[]> {
  const tenantData = [
    { name: 'zebra', description: 'Zebra Internal Team' },
    { name: 'acme-corp', description: 'ACME Corporation' },
    { name: 'globex', description: 'Globex Inc.' },
    { name: 'initech', description: 'Initech Solutions' },
    { name: 'umbrella', description: 'Umbrella Group' },
    { name: 'waynetech', description: 'Wayne Technologies' },
    { name: 'hooli', description: 'Hooli Platform' },
    { name: 'wonka', description: 'Wonka Industries' },
    { name: 'stark-industries', description: 'Stark Industries' },
    { name: 'daily-planet', description: 'Daily Planet Media' },
  ];

  const tenants = tenantData.map(data => dataSource.manager.create(Tenant, data));
  return dataSource.manager.save(tenants);
}

async function createFeatures(dataSource: DataSource): Promise<Feature[]> {
  const featureData = [
    { name: 'new-dashboard', description: 'Enables the redesigned dashboard UI' },
    { name: 'dark-mode', description: 'Activates dark mode for the frontend' },
    { name: 'beta-feature', description: 'Gives access to a new beta module' },
    { name: 'ai-search', description: 'Experimental AI-powered search' },
    { name: 'referral-system', description: 'Referral tracking and rewards' },
  ];

  const features = featureData.map(data => dataSource.manager.create(Feature, data));
  return dataSource.manager.save(features);
}

async function createFeatureFlags(
  dataSource: DataSource,
  tenants: Tenant[],
  features: Feature[],
): Promise<FeatureFlag[]> {
  const flags: FeatureFlag[] = [];

  const strategies = [StrategyType.BOOLEAN, StrategyType.PERCENTAGE, StrategyType.TARGETING];

  const environments = [Environment.DEV, Environment.STAGING, Environment.PROD];

  tenants.forEach((tenant, tIndex) => {
    features.forEach((feature, fIndex) => {
      const strategy = strategies[(tIndex + fIndex) % strategies.length];
      const environment = environments[(tIndex + fIndex) % environments.length];

      let value: Record<string, any> | null = null;

      if (strategy === StrategyType.PERCENTAGE) {
        value = { percentage: [10, 25, 50, 75][(fIndex + tIndex) % 4] };
      } else if (strategy === StrategyType.TARGETING) {
        value = {
          userIds: [`user_${tenant.name}_a`, `user_${tenant.name}_b`],
        };
      }

      const flag = dataSource.manager.create(FeatureFlag, {
        tenant,
        feature,
        environment,
        enabled: fIndex % 2 === 0,
        strategy,
        value,
      });

      flags.push(flag);
    });
  });

  return dataSource.manager.save(flags);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // clear database
  console.log('🔧 Clearing database...');
  await dataSource.synchronize(true);

  console.log('🔧 Seeding users...');
  await createUsers(dataSource);

  console.log('🔧 Seeding tenants...');
  const tenants = await createTenants(dataSource);

  console.log('🔧 Seeding features...');
  const features = await createFeatures(dataSource);

  console.log('🔧 Seeding feature flags...');
  await createFeatureFlags(dataSource, tenants, features);

  console.log('✅ Database seed completed.');
  await app.close();
}

bootstrap();
