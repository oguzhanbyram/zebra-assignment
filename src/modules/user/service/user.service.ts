import { CreateUserDto } from '../dto';
import { User } from '../entity/user.entity';

export interface UserService {
  create(data: CreateUserDto): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}
