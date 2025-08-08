import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tenant } from '@modules/tenant/entity';
import { TenantMapperImpl } from '@modules/tenant/mapper';
import { TenantRepositoryImpl } from '@modules/tenant/repository';
import { TenantServiceImpl } from '@modules/tenant/service';
import { TENANT_MAPPER, TENANT_REPOSITORY, TENANT_SERVICE } from '@modules/tenant/tenant.constants';
import { TenantController } from '@modules/tenant/tenant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [
    { provide: TENANT_MAPPER, useClass: TenantMapperImpl },
    { provide: TENANT_REPOSITORY, useClass: TenantRepositoryImpl },
    { provide: TENANT_SERVICE, useClass: TenantServiceImpl },
  ],
  exports: [TENANT_SERVICE],
})
export class TenantModule {}
