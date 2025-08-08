import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AUTH_SERVICE } from '@modules/auth/auth.constants';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthServiceImpl } from '@modules/auth/service';
import { TenantModule } from '@modules/tenant';
import { UserModule } from '@modules/user';

@Module({
  imports: [JwtModule.register({ global: true }), UserModule, TenantModule],
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE, useClass: AuthServiceImpl }],
})
export class AuthModule {}
