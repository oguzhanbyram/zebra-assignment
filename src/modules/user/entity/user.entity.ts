import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@shared/entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
