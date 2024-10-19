import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseService } from '../core/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository, User);
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }
}
