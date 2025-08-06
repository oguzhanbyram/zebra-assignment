import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tenant } from '@modules/tenant/entity';
import { TenantRepositoryImpl } from '@modules/tenant/repository';
import { TenantServiceImpl } from '@modules/tenant/service';
import { TENANT_SERVICE, TENANT_REPOSITORY } from '@modules/tenant/tenant.constants';
import { TenantController } from '@modules/tenant/tenant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [
    {
      provide: TENANT_SERVICE,
      useClass: TenantServiceImpl,
    },
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantRepositoryImpl,
    },
  ],
  exports: [TENANT_SERVICE],
})
export class TenantModule {}
