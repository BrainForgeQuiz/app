import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'ref-jwt') {
  constructor() {
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

  validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
