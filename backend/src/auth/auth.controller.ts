import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import Response from '../responses/response';
import { TokenResponse } from '../responses/token.response';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

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
  getUserInfo(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request): Response {
    req.logout(function (err) {
      if (err) {
        console.log(err);
      }
    });
    return {
      success: !req.user,
      data: req.user,
    };
  }

  /**
   * Login endpoint
   * @description This function logs in a user
   * @param {Request} req - The request object
   * @returns {any} The user object
   * @throws {UnauthorizedException} If the user is not found
   * @throws {BadRequestException} If the user is not found
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Req() req: Request) {
    return req.user;
  }
}
