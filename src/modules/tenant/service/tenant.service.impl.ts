import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Page, Pageable } from '@common/dto';

import { PaginationUtil } from '@shared/utils';

import { CreateTenantDto, TenantFilterDto, TenantResponseDto, UpdateTenantDto } from '@modules/tenant/dto';
import { TenantMapper } from '@modules/tenant/mapper';
import { TenantRepository } from '@modules/tenant/repository';
import { TenantService } from '@modules/tenant/service';
import { TENANT_MAPPER, TENANT_REPOSITORY } from '@modules/tenant/tenant.constants';

@Injectable()
export class TenantServiceImpl implements TenantService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
    @Inject(TENANT_MAPPER)
    private readonly tenantMapper: TenantMapper,
  ) {}

  async create(data: CreateTenantDto): Promise<TenantResponseDto> {
    const existing = await this.tenantRepository.findByName(data.name);

    if (existing) {
      throw new ConflictException('Tenant with this name already exists');
    }

    const tenant = await this.tenantRepository.create(data);

    return this.tenantMapper.mapToTenantResponse(tenant);
  }

  async findAll(pageable: Pageable, filter: TenantFilterDto): Promise<Page<TenantResponseDto>> {
    const page = await this.tenantRepository.findAll(pageable, filter);

    return PaginationUtil.mapPage(page, tenant => this.tenantMapper.mapToTenantResponse(tenant));
  }

  async findById(id: string): Promise<TenantResponseDto> {
    const tenant = await this.tenantRepository.findById(id);

    return this.tenantMapper.mapToTenantResponse(tenant);
  }

  async update(id: string, data: UpdateTenantDto): Promise<TenantResponseDto> {
    const existing = await this.tenantRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }

    const updatedTenant = await this.tenantRepository.update(id, data);

    return this.tenantMapper.mapToTenantResponse(updatedTenant);
  }

  delete(id: string): Promise<boolean> {
    return this.tenantRepository.delete(id);
  }

  async findByName(name: string): Promise<TenantResponseDto> {
    const tenant = await this.tenantRepository.findByName(name);

    if (!tenant) {
      throw new NotFoundException(`Tenant with name ${name} not found`);
    }

    return this.tenantMapper.mapToTenantResponse(tenant);
  }
}
