import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DbModule } from '../db/db.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [DbModule],
})
export class GameModule {}
