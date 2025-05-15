import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import * as process from 'node:process';

export default registerAs(
  'ref',
  (): JwtSignOptions => ({
    secret: process.env.REF_SECRET,
    expiresIn: '3h',
  }),
);
