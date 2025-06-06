import { Injectable } from '@nestjs/common';
import { StartGameDto } from './dto/start-game.dto';
import { CheckGameDto } from './dto/check-game.dto';
import { DbService } from '../db/db.service';
import { SimpleQuestionTable } from '../db/schema/question';
import { desc, eq } from 'drizzle-orm';
import { Game, QuestionSendBack } from './entities/game.entity';
import { JwtService } from '@nestjs/jwt';
import { GetQuestionDto } from './dto/get-question.dto';
import { UserTable } from '../db/schema/user';
import { GameStatus } from './entities/game.status';

@Injectable()
export class GameService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async getLeaderBoard(limit: number, userId: string) {
    const userCheck = await this.dbService.db
      .select({
        points: UserTable.points,
      })
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .execute();
    if (userCheck.length === 0) {
      return {
        success: false,
        data: null,
        error: 'User not found',
      };
    }
    const dbCheck = await this.dbService.db
      .select({
        id: UserTable.id,
        username: UserTable.username,
        points: UserTable.points,
      })
      .from(UserTable)
      .orderBy(desc(UserTable.points))
      .limit(limit);
    if (dbCheck.length === 0) {
      return {
        success: false,
        data: null,
        error: 'No users found',
      };
    }
    return {
      success: true,
      data: {
        leaderboard: dbCheck,
        userPoints: userCheck[0].points,
      },
      error: null,
    };
  }

  async start(startGameDto: StartGameDto, userId: string) {
    const dbCheck = await this.dbService.db
      .select({
        id: SimpleQuestionTable.id,
        question: SimpleQuestionTable.question,
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
        question: dbCheck[i].question,
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
      tries: this.addUpTries(game.listOfQuestions),
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
    const currentPoints = await this.dbService.db
      .select({
        points: UserTable.points,
      })
      .from(UserTable)
      .where(eq(UserTable.id, userId));
    if (currentPoints.length === 0) {
      return {
        success: false,
        data: null,
        error: 'User not found',
      };
    }
    const res = await this.dbService.db
      .update(UserTable)
      .set({
        points: points + currentPoints[0].points,
      })
      .where(eq(UserTable.id, userId))
      .returning({
        points: UserTable.points,
      })
      .execute();
    return {pointsBefore: currentPoints[0].points, pointsAfter: res[0].points};
  }

  addUpPoints(questions: QuestionSendBack[]) {
    let points = 0;
    for (let i = 0; i < questions.length; i++) {
      points += questions[i].score;
    }
    return points;
  }

  addUpTries(questions: QuestionSendBack[]) {
    let tries = 0;
    for (let i = 0; i < questions.length; i++) {
      tries += questions[i].trys;
    }
    return tries;
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
    let gameStatus: GameStatus;
    if (answer[0].answer === checkGameDto.answer) {
      gs.game.listOfQuestions[question].score += 1;
      gs.game.listOfQuestions[question].trys -= 1;
      gameStatus = GameStatus.CORRECT;
    } else {
      gs.game.listOfQuestions[question].trys += 1;
      gameStatus = GameStatus.WRONG;
    }

    if (this.checkGameOver(gs.game.listOfQuestions)) {
      return {
        success: true,
        gameStatus: GameStatus.GAMEOVER,
        data: await this.savePoints(
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
      gameStatus: gameStatus,
      tries: this.addUpTries(gs.game.listOfQuestions),
      data: gameToken,
    };
  }
}
