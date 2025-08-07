import { Injectable } from '@nestjs/common';

import { UserResponseDto } from '@modules/user/dto';
import { User } from '@modules/user/entity';
import { UserMapper } from '@modules/user/mapper';

@Injectable()
export class UserMapperImpl implements UserMapper {
  mapToUserResponse(user: User): UserResponseDto {
    const { id, username, role, tenantId } = user;
    return { id, username, role, tenantId };
  }

  mapToUserResponseList(users: User[]): UserResponseDto[] {
    return users.map(user => this.mapToUserResponse(user));
  }
}
