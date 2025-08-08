import { TenantResponseDto } from '@modules/tenant/dto';
import { Tenant } from '@modules/tenant/entity';

export interface TenantMapper {
  mapToTenantResponse(tenant: Tenant): TenantResponseDto;
  mapToTenantResponseList(tenants: Tenant[]): TenantResponseDto[];
}
