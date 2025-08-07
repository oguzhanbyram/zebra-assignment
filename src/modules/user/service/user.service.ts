import { CreateUserDto, UserResponseDto } from '@modules/user/dto';

export interface UserService {
  create(data: CreateUserDto): Promise<UserResponseDto>;
  findByUsername(username: string): Promise<UserResponseDto>;
  validateUserCredentials(username: string, password: string): Promise<UserResponseDto>;
}
