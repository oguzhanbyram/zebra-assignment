import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsEnum, IsString } from 'class-validator';

import { Environment } from '@modules/feature-flag/enum';

export class PromoteFeatureFlagsDto {
  @ApiProperty({ enum: Environment })
  @IsEnum(Environment)
  sourceEnv: Environment;

  @ApiProperty({ enum: Environment })
  @IsEnum(Environment)
  targetEnv: Environment;

  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  dryRun?: boolean;
}
