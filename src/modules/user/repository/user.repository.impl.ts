import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseRepositoryImpl } from '@shared/repository';

import { User } from '@modules/user/entity';
import { UserRepository } from '@modules/user/repository';

@Injectable()
export class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tenant', 'tenant')
      .where('user.username = :username', { username })
      .getOne();
  }
}
