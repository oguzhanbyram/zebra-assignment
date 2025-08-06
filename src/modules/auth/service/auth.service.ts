import { LoginDto, LoginResponseDto } from '../dto';

export interface AuthService {
  login(data: LoginDto): Promise<LoginResponseDto>;
}
