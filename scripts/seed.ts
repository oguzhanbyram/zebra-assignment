import { NestFactory } from '@nestjs/core';

import { seedFeatureFlags } from 'db/seeds/feature-flag.seeder';
import { seedFeatures } from 'db/seeds/feature.seeder';
import { seedTenants } from 'db/seeds/tenant.seeder';
import { seedUsers } from 'db/seeds/user.seeder';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🧹 Cleaning database...');
  await dataSource.synchronize(true);

  console.log('🌱 Seeding tenants...');
  const tenants = await seedTenants(dataSource);
  const tenantMap = new Map(tenants.map(t => [t.name, t]));

  console.log('🌱 Seeding features...');
  const features = await seedFeatures(dataSource);

  console.log('🌱 Seeding users...');
  await seedUsers(dataSource, tenantMap);

  console.log('🌱 Seeding feature flags...');
  await seedFeatureFlags(dataSource, tenants, features);

  console.log('✅ All seed data inserted successfully.');
  await app.close();
}

bootstrap().catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
