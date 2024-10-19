import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Token, TokenKind } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class TokenService extends BaseService<Token> {
  constructor(
    @InjectRepository(Token)
    protected readonly repository: Repository<Token>,
  ) {
    super(repository, Token);
  }

  async findRefreshToken(token: string) {
    return await this.repository.findOne({
      where: {
        token,
        kind: TokenKind.REFRESH,
      },
      relations: {
        user: true,
      }
    });
  }

  async findLastByTimeout(userEmail: string, timeout: number, kind: TokenKind) {
    const timeoutDate = new Date(Date.now() - timeout * 1000);

    return await this.repository.findOne({
      where: {
        user: {
          email: userEmail,
        },
        kind,
        createdAt: MoreThanOrEqual(timeoutDate),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findRecoverPasswordToken(token: string) {
    const timeoutDate = new Date(Date.now() - 300 * 1000);

    return await this.repository.findOne({
      where: {
        token,
        kind: TokenKind.RECOVER_PASSWORD,
        createdAt: MoreThanOrEqual(timeoutDate),
      },
      relations: {
        user: true,
      }
    });
  }

  async findByToken(token: string) {
    return await this.repository.findOne({
      where: {
        token,
      },
      relations: {
        user: true,
      }
    });
  }
}
