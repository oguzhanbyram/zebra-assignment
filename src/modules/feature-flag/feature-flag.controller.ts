import { Body, Controller, Delete, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginatedResponse, UuidParam } from '@common/decorator';
import { Page, Pageable } from '@common/dto';

import { AuthGuard } from '@modules/auth';
import {
  FeatureFlagResponseDto,
  FeatureFlagFilterDto,
  UpsertFeatureFlagDto,
  EvaluateFeatureFlagDto,
} from '@modules/feature-flag/dto';
import { FEATURE_FLAG_SERVICE } from '@modules/feature-flag/feature-flag.constants';
import { FeatureFlagService } from '@modules/feature-flag/service';

@ApiTags('feature-flag-controller')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class FeatureFlagController {
  constructor(
    @Inject(FEATURE_FLAG_SERVICE)
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Get('feature-flags')
  @ApiOperation({ summary: 'Get all feature flags (with pagination & filtering)' })
  @PaginatedResponse(FeatureFlagResponseDto)
  findAll(@Query() pageable: Pageable, @Query() filter: FeatureFlagFilterDto): Promise<Page<FeatureFlagResponseDto>> {
    return this.featureFlagService.findAll(pageable, filter);
  }

  @Post('feature-flags')
  @ApiOperation({ summary: 'Add or update a feature flag' })
  upsert(@Body() body: UpsertFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    return this.featureFlagService.upsert(body);
  }

  @Post('feature-flags/evaluate')
  @ApiOperation({ summary: 'Evaluate a feature flag for a given user' })
  async evaluateFeature(@Body() dto: EvaluateFeatureFlagDto): Promise<{ isEnabled: boolean }> {
    const isEnabled = await this.featureFlagService.evaluate(dto);
    return { isEnabled };
  }

  @Delete('feature-flags/:featureFlagId')
  @ApiOperation({ summary: 'Delete a feature flag by ID' })
  delete(@UuidParam('featureFlagId') id: string): Promise<boolean> {
    return this.featureFlagService.delete(id);
  }
}
