import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './db/db.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [DbModule, AuthModule, QuizModule, QuestionModule, GameModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
