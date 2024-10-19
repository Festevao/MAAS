import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Res,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { UserService } from '../user/user.service';
import { Public } from './guards/public.guard';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserResponseDTO } from 'src/user/dto/user-reponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: LoginDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUpDto: CreateUserDTO) {
    return this.authService.signUp(signUpDto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(AuthGuard)
  async refresh(@Body() refreshTokenDto: RefreshTokenDTO) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Put('change-password')
  @ApiSecurity('Auth')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDTO,
  ) {
    await this.authService.changePassword(req.user.email, changePasswordDto.oldPassword, changePasswordDto.newPassword);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    await this.authService.sendEmailForgotPassword(forgotPasswordDto.email);
  }

  @Get('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Res() res: Response,
    @Query('token') token: string,
    @Query('redirectUrl') redirectUrl?: string,
  ) {
    try {
      const tokenInstance = await this.authService.getToken(token);
  
      return res.render('reset-password-form', {
        name: tokenInstance?.user?.fullName ?? 'Usuário',
        email: tokenInstance?.user?.email ?? '',
        token,
        redirectUrl,
      });
    } catch(e) {
      console.error(e);

      return res.render('reset-password-error');
    }
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPasswordPost(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDTO,
  ) {
    await this.authService.resetPassword(token, resetPasswordDto.password);
  }

  @Get('profile')
  @ApiSecurity('Auth')
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.sub);
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDTO(user);
  }
}