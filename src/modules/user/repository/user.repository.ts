import { BaseRepository } from '@shared/repository';

import { User } from '@modules/user/entity';

export interface UserRepository extends BaseRepository<User> {
  findByUsername(username: string): Promise<User | null>;
}
