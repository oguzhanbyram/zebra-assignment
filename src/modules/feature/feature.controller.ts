import { Body, Controller, Delete, Get, Inject, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginatedResponse, Roles, UuidParam } from '@common/decorator';
import { Page, Pageable } from '@common/dto';
import { UserRole } from '@common/enum';

import { FeatureResponseDto, FeatureFilterDto, CreateFeatureDto, UpdateFeatureDto } from '@modules/feature/dto';
import { FEATURE_SERVICE } from '@modules/feature/feature.constants';
import { FeatureService } from '@modules/feature/service';

@ApiTags('feature-controller')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller()
export class FeatureController {
  constructor(
    @Inject(FEATURE_SERVICE)
    private readonly featureService: FeatureService,
  ) {}

  @Get('features')
  @ApiOperation({ summary: 'Get all features' })
  @PaginatedResponse(FeatureResponseDto)
  findAll(@Query() pageable: Pageable, @Query() filter: FeatureFilterDto): Promise<Page<FeatureResponseDto>> {
    return this.featureService.findAll(pageable, filter);
  }

  @Get('features/:featureId')
  @ApiOperation({ summary: 'Get feature by ID' })
  find(@UuidParam('featureId') featureId: string): Promise<FeatureResponseDto> {
    return this.featureService.findById(featureId);
  }

  @Post('features')
  @ApiOperation({ summary: 'Create a new feature' })
  create(@Body() request: CreateFeatureDto): Promise<FeatureResponseDto> {
    return this.featureService.create(request);
  }

  @Put('features/:featureId')
  @ApiOperation({ summary: 'Modify details of an existing feature.' })
  update(@UuidParam('featureId') featureId: string, @Body() request: UpdateFeatureDto): Promise<FeatureResponseDto> {
    return this.featureService.update(featureId, request);
  }

  @Delete('features/:featureId')
  @ApiOperation({ summary: 'Delete a feature' })
  delete(@UuidParam('featureId') featureId: string): Promise<boolean> {
    return this.featureService.delete(featureId);
  }
}
