import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@modules/user/entity';
import { UserMapperImpl } from '@modules/user/mapper';
import { UserRepositoryImpl } from '@modules/user/repository';
import { UserServiceImpl } from '@modules/user/service';
import { USER_MAPPER, USER_REPOSITORY, USER_SERVICE } from '@modules/user/user.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    { provide: USER_MAPPER, useClass: UserMapperImpl },
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: USER_SERVICE, useClass: UserServiceImpl },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}
