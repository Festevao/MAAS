import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/auth/token.service';
import { TokenKind } from 'src/auth/entities/token.entity';
import { UserResponseDTO } from 'src/user/dto/user-reponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.userService.findByEmail(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await bcrypt.compare(pass, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      fullName: user.fullName,
      email: user.email,
    };
    
    const expires_in = 30;
    
    const access_token = await this.jwtService.signAsync({ ...payload, type: TokenKind.ACCESS });
    const refresh_token = await this.jwtService.signAsync({ ...payload, type: TokenKind.REFRESH }, { expiresIn: '1y' });

    await this.tokenService.create({
      token: refresh_token,
      kind: TokenKind.REFRESH,
      user,
    });

    return new LoginResponseDTO({
      access_token,
      expires_in,
      refresh_token,
    });
  }

  async refreshToken(refreshToken: string) {
    const token = await this.tokenService.findRefreshToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = token.user;
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      const payload = {
        sub: user.id,
        fullName: user.fullName,
        email: user.email,
      };

      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync({ ...payload, type: 'refresh' }, { expiresIn: '1y' });

      token.token = refresh_token;
      await token.save();

      const expires_in = 30;

      return new LoginResponseDTO({
        access_token,
        refresh_token,
        expires_in,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signUp(args: CreateUserDTO) {
    return new UserResponseDTO(await this.userService.create({
      ...args,
    }));
  }

  async resetPassword(token: string, password: string) {
    const tokenInstance = await this.tokenService.findRecoverPasswordToken(token);

    if (!tokenInstance || tokenInstance.kind !== TokenKind.RECOVER_PASSWORD) {
      throw new NotFoundException('User not found');
    }

    tokenInstance.user.password = bcrypt.hashSync(password, 12);
    await tokenInstance.user.save();
    await tokenInstance.remove();
  }

  async getToken(token: string) {
    const tokenInstance = await this.tokenService.findByToken(token);

    if (!tokenInstance) {
      throw new NotFoundException('User not found');
    }

    return tokenInstance;
  }

  async changePassword(userEmail: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.findByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.password = bcrypt.hashSync(newPassword, 12);
    await user.save();
  }

  async sendEmailForgotPassword(userEmail: string) {
    const lastToken = await this.tokenService.findLastByTimeout(userEmail, 300, TokenKind.RECOVER_PASSWORD);
    if (lastToken) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    const user = await this.userService.findByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.tokenService.create({
      user,
      token: Math.random().toString(16).substring(2),
      kind: TokenKind.RECOVER_PASSWORD,
    });

    try {
      await this.emailService.sendTemplateEmail(
        user.email,
        '[MAAS] Redefinir senha',
        'recover-password',
        {
          link: `http://localhost:${process.env.PORT}/auth/reset-password`,
          token: token.token,
          name: user.fullName,
        }
      );
    } catch(e) {
      token.remove();
      throw e;
    }
  }
}
