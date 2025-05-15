import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import TokenPayload from '../dto/token.payload';

import { AuthService } from '../auth.service';

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

  validate(payload: TokenPayload) {
    console.log('RefStrategy payload:', payload);
    return { id: payload.sub, username: payload.username };
  }
}
