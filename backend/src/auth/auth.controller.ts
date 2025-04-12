import { Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import Response from '../responses/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * @param {any} loginDto - The login data transfer object
   * @returns {Response} An object that contains the login response
   */
  @Post()
  async login(@Body() loginDto: any): Promise<Response> {
    try {
      await this.authService.login(loginDto);
      throw new NotImplementedException('Login-not-implemented');
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
