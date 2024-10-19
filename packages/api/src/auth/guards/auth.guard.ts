import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.guard';
import { JWTPayload } from '../types/JwtPayload';
import { TokenKind } from '../entities/token.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decodedToken = await this.jwtService.verifyAsync<JWTPayload>(token, { secret: process.env.JWT_SECRET });
        if (decodedToken.type !== TokenKind.ACCESS) {
          throw new UnauthorizedException('Not authenticated');  
        }
        request.user = decodedToken;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Not authenticated');
      }
    }

    throw new UnauthorizedException('Not authenticated');
  }
}
