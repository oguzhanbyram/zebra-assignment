import { BaseRepository } from '@shared/repository';

import { Tenant } from '@modules/tenant/entity';

export interface TenantRepository extends BaseRepository<Tenant> {
  findByName(name: string): Promise<Tenant | null>;
}
