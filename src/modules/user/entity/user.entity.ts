import { Column, Entity, JoinColumn, ManyToOne, Relation, RelationId } from 'typeorm';

import { UserRole } from '@common/enum';

import { BaseEntity } from '@shared/entity';

import { Tenant } from '@modules/tenant';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TENANT })
  role: UserRole;

  @ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Relation<Tenant>;

  @RelationId((user: User) => user.tenant)
  tenantId?: string;
}
