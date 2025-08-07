import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from '@modules/user/dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token for authenticated requests.' })
  accessToken: string;

  @ApiProperty({ type: () => UserResponseDto, description: 'Authenticated user information.' })
  user: UserResponseDto;
}
