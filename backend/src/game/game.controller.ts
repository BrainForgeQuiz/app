import { Controller, Get, Body, Post, UseGuards, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { GetQuestionDto } from './dto/get-question.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/start')
  start(@Body() startGameDto: StartGameDto, @Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.gameService.start(startGameDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/question')
  getQuestions(@Body() getQuestionDto: GetQuestionDto, @Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.gameService.getQuestions(getQuestionDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/check')
  check(@Body() checkGameDto: CheckGameDto, @Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.gameService.check(checkGameDto, req.user.id);
  }
}
