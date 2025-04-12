import { Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import Response from '../responses/response';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * @description This function creates a jwt, if the user credentials are that can be used for further auth
   * @param {LoginDto} dto - The login data transfer object
   * @returns {Response} An object that contains the login response
   */
  @Post()
  async signIn(@Body() dto: LoginDto): Promise<Response> {
    try {
      const token = await this.authService.signIn(dto.username, dto.password);
      return {
        success: true,
        data: token.access_token,
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
