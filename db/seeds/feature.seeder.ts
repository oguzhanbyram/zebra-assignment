import { readFile } from 'fs/promises';
import { join } from 'path';

import { DataSource } from 'typeorm';

import { Feature } from '../../src/modules/feature';

export async function seedFeatures(dataSource: DataSource): Promise<Feature[]> {
  const featureRepo = dataSource.getRepository(Feature);

  try {
    const filePath = join(__dirname, 'data', 'feature-data.json');
    const file = await readFile(filePath, 'utf8');
    const featureData: Partial<Feature>[] = JSON.parse(file);

    if (!Array.isArray(featureData) || featureData.length === 0) {
      console.warn('⚠️  No feature data found in JSON.');
      return [];
    }

    const features = featureData.map(data => featureRepo.create(data));
    await featureRepo.save(features);

    console.log(`✅ Seeded ${features.length} features.`);
    return features;
  } catch (err) {
    console.error('❌ Failed to seed features:', err);
    return [];
  }
}
