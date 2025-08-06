import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'zebra_admin' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @ApiProperty({ example: 'secure_password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
