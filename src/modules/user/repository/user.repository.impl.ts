import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@shared/repository';

import { UserRepository } from './user.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }
}
