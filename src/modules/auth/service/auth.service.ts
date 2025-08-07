import { LoginDto, LoginResponseDto } from '@modules/auth';

export interface AuthService {
  login(dto: LoginDto): Promise<LoginResponseDto>;
}
