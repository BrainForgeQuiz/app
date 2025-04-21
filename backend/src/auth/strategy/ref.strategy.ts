import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'node:process';
import TokenPayload from '../dto/token.payload';
import { User } from '../../entity/user';
import { AuthService } from '../auth.service';
import { UserInDBResponse } from '../../responses/db.response';

@Injectable()
export class RefStrategy extends PassportStrategy(Strategy, 'ref-jwt') {
  constructor(private readonly authService: AuthService) {
    const secret = process.env.REF_SECRET;
    if (!secret) {
      throw new Error('REF JWT secret not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: TokenPayload) {
    console.log('RefStrategy payload:', payload);
    const user: UserInDBResponse = await this.authService.findUser(
      payload.username,
    );
    if (!user.user) {
      throw new UnauthorizedException();
    }
    return await this.authService.refToken(user.user);
  }
}
