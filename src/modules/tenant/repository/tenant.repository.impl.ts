import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@shared/repository';

import { Tenant } from '@modules/tenant/entity';
import { TenantRepository } from '@modules/tenant/repository';

@Injectable()
export class TenantRepositoryImpl extends BaseRepositoryImpl<Tenant> implements TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    repo: Repository<Tenant>,
  ) {
    super(repo);
  }

  findByName(name: string): Promise<Tenant | null> {
    return this.repo.createQueryBuilder('tenant').where('tenant.name = :name', { name }).getOne();
  }

  findByApiKey(apiKey: string): Promise<Tenant | null> {
    return this.repo.createQueryBuilder('tenant').where('tenant.apiKey = :apiKey', { apiKey }).getOne();
  }
}
