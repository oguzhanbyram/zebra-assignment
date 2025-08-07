import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@common/interface';

import { UserService } from '@modules/user/service/user.service';
import { USER_SERVICE } from '@modules/user/user.constants';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from '../dto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.validateUserCredentials(data.username, data.password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, user };
  }
}
