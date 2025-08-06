import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from '@modules/user/service/user.service';
import { USER_SERVICE } from '@modules/user/user.constants';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from '../dto';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByUsername(data.username);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '1h',
    });

    return { accessToken };
  }
}
