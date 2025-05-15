import { Controller, Get, Body, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/start')
  start(@Body() startGameDto: StartGameDto) {
    return this.gameService.start(startGameDto);
  }

  @Post('/check')
  check(@Body() checkGameDto: CheckGameDto) {
    return this.gameService.check(checkGameDto);
  }
}
