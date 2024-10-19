import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Package extends BaseEntity {
  @Column('varchar', { name: 'name' })
  name: string;

  @Column('json', { name: 'themes' })
  themes: string[];

  @Column('float', { name: 'version', default: 1 })
  version: number;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.packages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}