import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'zebra_admin' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secure_password123' })
  @IsString()
  password: string;
}
