import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DbModule } from '../db/db.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [DbModule,JwtModule],
})
export class GameModule {}
