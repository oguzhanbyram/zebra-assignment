import { Inject, Injectable } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { CreateTenantDto, TenantFilterDto, UpdateTenantDto } from '@modules/tenant/dto';
import { Tenant } from '@modules/tenant/entity';
import { TenantRepository } from '@modules/tenant/repository';
import { TenantService } from '@modules/tenant/service/tenant.service';
import { TENANT_REPOSITORY } from '@modules/tenant/tenant.constants';

@Injectable()
export class TenantServiceImpl implements TenantService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
  ) {}

  create(data: CreateTenantDto): Promise<Tenant> {
    return this.tenantRepository.create(data);
  }

  findAll(pageable: Pageable, filter: TenantFilterDto): Promise<Page<Tenant>> {
    return this.tenantRepository.findAll(pageable, filter);
  }

  findById(id: string): Promise<Tenant> {
    return this.tenantRepository.findById(id);
  }

  update(id: string, data: UpdateTenantDto): Promise<Tenant> {
    return this.tenantRepository.update(id, data);
  }

  delete(id: string): Promise<boolean> {
    return this.tenantRepository.delete(id);
  }

  findByName(name: string): Promise<Tenant | null> {
    return this.tenantRepository.findByName(name);
  }
}
