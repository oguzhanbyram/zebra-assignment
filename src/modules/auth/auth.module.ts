import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@modules/user/user.module';

import { AUTH_SERVICE } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthServiceImpl } from './service/auth.service.impl';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE, useClass: AuthServiceImpl }],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
