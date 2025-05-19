import { Injectable } from '@nestjs/common';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';
import { DbService } from '../db/db.service';
import { SimpleQuestionTable } from '../db/schema/question';
import { eq } from 'drizzle-orm';
import { Game, QuestionSendBack } from './entities/game.entity';
import { JwtService } from '@nestjs/jwt';
import { GetQuestionDto } from './dto/get-question.dto';
import { UserTable } from '../db/schema/user';

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

    const gameToken = await this.jwtService.signAsync(
      {
        game: game,
      },
      {
        expiresIn: '2h',
      },
    );

    return {
      success: true,
      data: gameToken,
      error: null,
    };
  }

  checkGameOver(questions: QuestionSendBack[]) {
    let gameOver = true;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].trys > 0) {
        gameOver = false;
        break;
      }
    }
    return gameOver;
  }

  getRandomQuestion(questions: QuestionSendBack[]) {
    while (true) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      if (questions[randomIndex].trys > 0) {
        return {
          success: true,
          data: questions[randomIndex],
        };
      }
      if (questions.length === 0) {
        return {
          success: false,
          data: null,
          error: 'No questions left',
        };
      }
    }
  }

  async savePoints(userId: string, points: number) {
    return await this.dbService.db
      .update(UserTable)
      .set({
        points: points,
      })
      .where(eq(UserTable.id, userId))
      .returning({
        points: UserTable.points,
      })
      .execute();
  }

  addUpPoints(questions: QuestionSendBack[]) {
    let points = 0;
    for (let i = 0; i < questions.length; i++) {
      points += questions[i].score;
    }
    return points;
  }

  getQuestions(getQuestionDto: GetQuestionDto, userId: string) {
    const gs: { game: Game } = this.jwtService.decode(getQuestionDto.gameState);
    if (!gs) {
      return {
        success: false,
        data: null,
        error: 'Game state is invalid',
      };
    }
    if (gs.game.userId !== userId) {
      return {
        success: false,
        data: null,
        error: 'User is not owner of game',
      };
    }
    return this.getRandomQuestion(gs.game.listOfQuestions);
  }

  async check(checkGameDto: CheckGameDto, userId: string) {
    const gs: { game: Game } = this.jwtService.decode(checkGameDto.gameState);
    if (!gs) {
      return {
        success: false,
        data: null,
        error: 'Game state is invalid',
      };
    }
    if (gs.game.userId !== userId) {
      return {
        success: false,
        data: null,
        error: 'User is not owner of game',
      };
    }
    const question = gs.game.listOfQuestions.findIndex(
      (q) => q.id === checkGameDto.questionId,
    );
    if (question === -1) {
      return {
        success: false,
        data: null,
        error: 'Question not found',
      };
    }

    const answer = await this.dbService.db
      .select({
        answer: SimpleQuestionTable.answer,
      })
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.id, gs.game.listOfQuestions[question].id));

    if (answer.length === 0) {
      return {
        success: false,
        data: null,
        error: 'Question not found',
      };
    }

    if (answer[0].answer === checkGameDto.answer) {
      gs.game.listOfQuestions[question].score += 1;
      gs.game.listOfQuestions[question].trys -= 1;
    } else {
      gs.game.listOfQuestions[question].trys += 1;
    }

    if (this.checkGameOver(gs.game.listOfQuestions)) {
      return {
        success: true,
        data: this.savePoints(
          userId,
          this.addUpPoints(gs.game.listOfQuestions),
        ),
      };
    }

    const gameToken = await this.jwtService.signAsync(
      { game: gs.game },
      { expiresIn: '2h' },
    );

    return {
      success: true,
      data: gameToken,
    };
  }
}
