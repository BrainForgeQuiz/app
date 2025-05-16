import { Injectable } from '@nestjs/common';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';
import { DbService } from '../db/db.service';
import { SimpleQuestionTable } from '../db/schema/question';
import { eq } from 'drizzle-orm';
import { Game, QuestionSendBack } from './entities/game.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GameService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async start(startGameDto: StartGameDto, userId: string) {
    const dbCheck = await this.dbService.db
      .select({
        id: SimpleQuestionTable.id,
      })
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.quizId, startGameDto.quizId));
    if (dbCheck.length === 0) {
      return {
        success: false,
        data: null,
        error: 'Quiz does not exist',
      };
    }

    const questions: QuestionSendBack[] = [];

    for (let i = 0; i < dbCheck.length; i++) {
      questions.push({
        id: dbCheck[i].id,
        trys: 3,
        score: 0,
      });
    }

    const game = new Game(userId, startGameDto.quizId, questions);

    const gameToken = this.jwtService.signAsync(game);

    return {
      success: true,
      data: gameToken,
      error: null,
    };
  }

  check(checkGameDto: CheckGameDto) {
    return 'This action checks the game';
  }
}
