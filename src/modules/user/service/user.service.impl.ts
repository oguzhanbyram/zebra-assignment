import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, UserResponseDto } from '@modules/user/dto';
import { UserMapper } from '@modules/user/mapper';
import { UserRepository } from '@modules/user/repository';
import { UserService } from '@modules/user/service';
import { USER_MAPPER, USER_REPOSITORY } from '@modules/user/user.constants';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(USER_MAPPER)
    private readonly userMapper: UserMapper,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByUsername(data.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: passwordHash,
      tenant: data.tenantId ? { id: data.tenantId } : null,
    });

    return this.userMapper.mapToUserResponse(user);
  }

  async findByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userMapper.mapToUserResponse(user);
  }

  async validateUserCredentials(username: string, password: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    return this.userMapper.mapToUserResponse(user);
  }
}
