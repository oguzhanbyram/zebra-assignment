import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'zebra_admin' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(3, { message: 'Username must be at least 3 characters long.' })
  @MaxLength(100, { message: 'Username must not exceed 100 characters.' })
  username: string;

  @ApiProperty({ example: 'secure_password123' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters.' })
  password: string;
}
