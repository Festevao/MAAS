import { TokenKind } from '../entities/token.entity';

export interface JWTPayload {
  sub: string,
  fullName: string,
  email: string,
  type: TokenKind,
  iat: number,
	exp: number,
}