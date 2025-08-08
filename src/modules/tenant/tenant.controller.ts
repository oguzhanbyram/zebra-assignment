import { Body, Controller, Delete, Get, Inject, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginatedResponse, Roles, UuidParam } from '@common/decorator';
import { Page, Pageable } from '@common/dto';
import { UserRole } from '@common/enum';

import { TenantResponseDto, TenantFilterDto, CreateTenantDto, UpdateTenantDto } from '@modules/tenant/dto';
import { TenantService } from '@modules/tenant/service';
import { TENANT_SERVICE } from '@modules/tenant/tenant.constants';

@ApiTags('tenant-controller')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller()
export class TenantController {
  constructor(
    @Inject(TENANT_SERVICE)
    private readonly tenantService: TenantService,
  ) {}

  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants' })
  @PaginatedResponse(TenantResponseDto)
  findAll(@Query() pageable: Pageable, @Query() filter: TenantFilterDto): Promise<Page<TenantResponseDto>> {
    return this.tenantService.findAll(pageable, filter);
  }

  @Get('tenants/:tenantId')
  @ApiOperation({ summary: 'Get tenant by ID' })
  find(@UuidParam('tenantId') tenantId: string): Promise<TenantResponseDto> {
    return this.tenantService.findById(tenantId);
  }

  @Post('tenants')
  @ApiOperation({ summary: 'Create a new tenant' })
  create(@Body() request: CreateTenantDto): Promise<TenantResponseDto> {
    return this.tenantService.create(request);
  }

  @Put('tenants/:tenantId')
  @ApiOperation({ summary: 'Modify details of an existing tenant.' })
  update(@UuidParam('tenantId') tenantId: string, @Body() request: UpdateTenantDto): Promise<TenantResponseDto> {
    return this.tenantService.update(tenantId, request);
  }

  @Delete('tenants/:tenantId')
  @ApiOperation({ summary: 'Delete a tenant' })
  delete(@UuidParam('tenantId') tenantId: string): Promise<boolean> {
    return this.tenantService.delete(tenantId);
  }
}
