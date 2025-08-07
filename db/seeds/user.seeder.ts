import { readFile } from 'fs/promises';
import { join } from 'path';

import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { UserRole } from '../../src/common/enum';
import { Tenant } from '../../src/modules/tenant/entity';
import { User } from '../../src/modules/user/entity';

export async function seedUsers(dataSource: DataSource, tenantMap: Map<string, Tenant>): Promise<User[]> {
  const userRepo = dataSource.getRepository(User);

  const filePath = join(__dirname, 'data', 'user-data.json');
  const file = await readFile(filePath, 'utf8');
  const userData: Array<{
    username: string;
    password: string;
    role: UserRole;
    tenantName?: string;
  }> = JSON.parse(file);

  const users: User[] = [];

  for (const user of userData) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    let tenant: Tenant | null = null;
    if (user.role === UserRole.TENANT && user.tenantName) {
      tenant = tenantMap.get(user.tenantName) || null;

      if (!tenant) {
        console.warn(`⚠️  Tenant "${user.tenantName}" not found for user "${user.username}". Skipping user.`);
        continue;
      }
    }

    const userEntity = userRepo.create({
      username: user.username,
      password: passwordHash,
      role: user.role,
      tenant,
    });

    users.push(userEntity);
  }

  await userRepo.save(users);
  console.log(`✅ Seeded ${users.length} users.`);
  return users;
}
