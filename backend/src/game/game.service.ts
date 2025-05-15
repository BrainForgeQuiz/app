import { Injectable } from '@nestjs/common';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';

@Injectable()
export class GameService {
  start(startGameDto: StartGameDto) {
    return 'This action adds a new game';
  }
  check(checkGameDto: CheckGameDto) {
    return 'This action checks the game';
  }
}
