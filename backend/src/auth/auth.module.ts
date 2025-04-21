import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import refConfig from './config/ref.config';
import { JwtModule } from '@nestjs/jwt';
import { RefStrategy } from './strategy/ref.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, RefStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refConfig),
  ],
})
export class AuthModule {}
