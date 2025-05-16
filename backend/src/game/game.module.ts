import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DbService } from '../db/db.service';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [DbService],
})
export class GameModule {}
