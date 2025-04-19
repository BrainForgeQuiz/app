import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import Response from '../responses/response';
import { LoginDto } from './dto/login.dto';
import { TokenResponse } from '../responses/token.response';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register endpoint
   * @description This function creates a user in the database
   * @param {RegisterDto} dto - The Register data transfer object
   * @returns {Response} An object that contains the signup response
   */
  @Post('register')
  async signUp(@Body() dto: RegisterDto): Promise<Response> {
    try {
      const res: TokenResponse = await this.authService.singUp(
        dto.username,
        dto.password,
        dto.email,
      );
      return {
        success: true,
        data: res,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: 'Internal server error',
        data: null,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserInfo(@Request() request) {
    return {
      req: request.user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  /**
   * Login endpoint
   * @description This function creates a jwt, if the user credentials are that can be used for further auth
   * @param {LoginDto} dto - The login data transfer object
   * @returns {Response} An object that contains the login response
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Body() dto: LoginDto): Promise<Response> {
    try {
      const res: TokenResponse = await this.authService.signIn(
        dto.username,
        dto.password,
      );
      if (res.success) {
        return {
          success: true,
          data: res.data,
        };
      }
      return {
        success: false,
        error: res.error,
        data: null,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: 'Internal server error',
        data: null,
      };
    }
  }
}
