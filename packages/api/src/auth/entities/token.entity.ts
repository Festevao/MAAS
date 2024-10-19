import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { User } from '../../user/entities/user.entity';

export enum TokenKind {
  RECOVER_PASSWORD = 'recover_password',
  REFRESH = 'refresh',
  ACCESS = 'access',
}

@Entity('token', { schema: process.env.DB_SCHEMA || 'public' })
export class Token extends BaseEntity {
  @Column('varchar', { name: 'token', length: 1024 })
  token: string;

  @Column('enum', { name: 'kind', enum: TokenKind })
  kind: TokenKind;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
