import { UserResponseDto } from '@modules/user/dto';
import { User } from '@modules/user/entity';

export interface UserMapper {
  mapToUserResponse(user: User): UserResponseDto;
  mapToUserResponseList(users: User[]): UserResponseDto[];
}
