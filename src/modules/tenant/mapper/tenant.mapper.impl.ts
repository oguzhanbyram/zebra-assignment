import { Injectable } from '@nestjs/common';

import { TenantResponseDto } from '@modules/tenant/dto';
import { Tenant } from '@modules/tenant/entity';
import { TenantMapper } from '@modules/tenant/mapper/tenant.mapper';

@Injectable()
export class TenantMapperImpl implements TenantMapper {
  mapToTenantResponse(tenant: Tenant): TenantResponseDto {
    const { id, name, description, plan, apiKey, createdAt, updatedAt } = tenant;

    return {
      id,
      name,
      description: description ?? null,
      plan,
      apiKey: apiKey ?? null,
      createdAt,
      updatedAt,
    };
  }

  mapToTenantResponseList(tenants: Tenant[]): TenantResponseDto[] {
    return tenants.map(tenant => this.mapToTenantResponse(tenant));
  }
}
