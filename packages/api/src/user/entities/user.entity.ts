import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Token } from '../../auth/entities/token.entity';
import { Package } from '../../package/entities/package.entity';
import * as bcrypt from 'bcrypt';

@Entity('user', { schema: process.env.DB_SCHEMA || 'public' })
export class User extends BaseEntity {
  @Column('varchar', { name: 'full_name' })
  fullName: string;

  @Column('varchar', { name: 'email', unique: true })
  email: string;

  @Column('varchar', { name: 'password', nullable: true })
  password: string | null;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Package, (packageEnt) => packageEnt.user)
  packages: Package[];

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 12);
    }
  }
}
