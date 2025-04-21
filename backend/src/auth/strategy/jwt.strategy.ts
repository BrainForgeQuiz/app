import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import TokenPayload from '../dto/token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('JWT secret not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: TokenPayload) {
    console.log('JwtStrategy payload:', payload);
    return { userId: payload.sub, username: payload.username };
  }
}
