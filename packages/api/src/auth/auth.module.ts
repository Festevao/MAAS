import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    JwtModule.registerAsync({
      useFactory: () => {
      const expiresIn = '30s';
      
      return {
        global: true,
        secret: process.env.JWT_KEY ?? '',
        signOptions: { expiresIn },
      };
    }
    }),
    TypeOrmModule.forFeature([Token]),
    EmailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
  ],
})
export class AuthModule {}
