import { Page, Pageable } from '@common/dto';

import { CreateTenantDto, TenantFilterDto, UpdateTenantDto } from '@modules/tenant/dto';
import { Tenant } from '@modules/tenant/entity';

export interface TenantService {
  create(data: CreateTenantDto): Promise<Tenant>;
  findAll(pageable: Pageable, filter: TenantFilterDto): Promise<Page<Tenant>>;
  findById(id: string): Promise<Tenant>;
  update(id: string, data: UpdateTenantDto): Promise<Tenant>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<Tenant | null>;
}
