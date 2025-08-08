import { ApiProperty } from '@nestjs/swagger';

import { PlanType, UserRole } from '@common/enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: () => UserRole, enum: UserRole })
  role: UserRole;

  @ApiProperty({ required: false })
  tenantId?: string;

  @ApiProperty({ type: () => PlanType, enum: PlanType, required: false })
  plan?: PlanType;
}
