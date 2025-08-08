import { Page, Pageable } from '@common/dto';

import { CreateTenantDto, TenantFilterDto, TenantResponseDto, UpdateTenantDto } from '@modules/tenant/dto';

export interface TenantService {
  create(data: CreateTenantDto): Promise<TenantResponseDto>;
  findAll(pageable: Pageable, filter: TenantFilterDto): Promise<Page<TenantResponseDto>>;
  findById(id: string): Promise<TenantResponseDto>;
  update(id: string, data: UpdateTenantDto): Promise<TenantResponseDto>;
  delete(id: string): Promise<boolean>;
  findByName(name: string): Promise<TenantResponseDto | null>;
}
