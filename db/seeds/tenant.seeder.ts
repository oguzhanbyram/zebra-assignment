import { readFile } from 'fs/promises';
import { join } from 'path';

import { DataSource } from 'typeorm';

import { Tenant } from '../../src/modules/tenant';

export async function seedTenants(dataSource: DataSource): Promise<Tenant[]> {
  const tenantRepo = dataSource.getRepository(Tenant);

  try {
    const filePath = join(__dirname, 'data', 'tenant-data.json');
    const file = await readFile(filePath, 'utf8');
    const tenantData: Partial<Tenant>[] = JSON.parse(file);

    if (!Array.isArray(tenantData) || tenantData.length === 0) {
      console.warn('⚠️  No tenant data found in JSON.');
      return [];
    }

    const tenants = tenantData.map(data => tenantRepo.create(data));
    await tenantRepo.save(tenants);

    console.log(`✅ Seeded ${tenants.length} tenants.`);
    return tenants;
  } catch (err) {
    console.error('❌ Failed to seed tenants:', err);
    return [];
  }
}
