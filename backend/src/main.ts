import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.SECRET);
  app.use(
    session({
      secret: process.env.SECRET ?? 'alma',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
