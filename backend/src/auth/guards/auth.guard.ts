import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(req);
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      req.user = {
        userId: payload.sub,
        username: payload.username,
      };
    } catch (error) {
      return false;
    }
    return true;
  }
}
