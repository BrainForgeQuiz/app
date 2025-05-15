import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import TokenPayload from '../dto/token.payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    console.log(req);
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token);
      req.user = {
        id: payload.sub,
        username: payload.username,
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
    return true;
  }
}
