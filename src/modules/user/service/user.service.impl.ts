import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { CreateUserDto } from '../dto';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { USER_REPOSITORY } from '../user.constants';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({ ...data, password: hashedPassword });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
}
