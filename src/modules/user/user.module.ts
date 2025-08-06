import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { UserServiceImpl } from './service/user.service.impl';
import { USER_REPOSITORY, USER_SERVICE } from './user.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: USER_SERVICE, useClass: UserServiceImpl },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}
