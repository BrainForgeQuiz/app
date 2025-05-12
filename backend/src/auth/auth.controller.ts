import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import Response from '../responses/response';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { RefAuthGuard } from './guards/ref-auth.guard';

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
    const res = await this.authService.singUp(
      dto.username,
      dto.password,
      dto.email,
    );
    return {
      success: res.success,
      error: res.error,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserInfo(@Req() req: Request) {
    return req.user?.id;
  }

  @UseGuards(RefAuthGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.authService.refToken(req.user.id, req.user.username);
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
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() req: Request): Promise<Response> {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return await this.authService.tokenGen(req.user.id, req.user.username);
  }
}
