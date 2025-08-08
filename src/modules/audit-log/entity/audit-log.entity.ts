import { Column, Entity } from 'typeorm';

import { AuditAction } from '@common/enum';

import { BaseEntity } from '@shared/entity';

@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @Column()
  resource: string;

  @Column({ type: 'uuid' })
  resourceId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column('jsonb', { nullable: true })
  diff?: Record<string, { from: any; to: any }>;

  @Column({ type: 'uuid' })
  actorId: string;

  @Column({ type: 'varchar' })
  actorName: string;
}
