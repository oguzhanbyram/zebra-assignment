import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { UserRole } from '@common/enum';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ type: () => UserRole, enum: UserRole, example: UserRole.ADMIN })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'e8d18a6c-5c38-4a2f-942c-1254607b7867', required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
