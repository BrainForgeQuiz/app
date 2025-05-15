import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DbService } from '../db/db.service';
import { SimpleQuestionTable } from '../db/schema/question';
import { eq } from 'drizzle-orm';
import { QuizTable } from '../db/schema/quiz';

@Injectable()
export class QuestionService {
  constructor(private readonly dbService: DbService) {}

  async checkIfUserIsOwner(userId: string, quizId: string): Promise<boolean> {
    const userCheck = await this.dbService.db
      .select({
        id: QuizTable.userId,
      })
      .from(QuizTable)
      .where(eq(QuizTable.id, quizId));
    if (userCheck.length === 0) {
      return false;
    }
    return userCheck[0].id === userId;
  }

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    const userCheckRes = await this.checkIfUserIsOwner(
      userId,
      createQuestionDto.quizId,
    );

    if (!userCheckRes) {
      return {
        success: false,
        data: null,
        error: 'User is not owner of quiz',
      };
    }

    const res = await this.dbService.db
      .insert(SimpleQuestionTable)
      .values({
        question: createQuestionDto.question,
        answer: createQuestionDto.answer,
        quizId: createQuestionDto.quizId,
        points: createQuestionDto.points,
      })
      .returning({
        id: SimpleQuestionTable.id,
      })
      .execute();

    if (res.length > 0) {
      return {
        success: true,
        data: res[0].id,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Question was not saved',
    };
  }

  async findAllForQuiz(quizId: string) {
    return await this.dbService.db
      .select()
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.quizId, quizId))
      .then((res) => {
        return {
          success: true,
          data: res,
          error: null,
        };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          data: null,
          error: 'Error fetching questions',
        };
      });
  }

  async findOne(id: string) {
    const res = await this.dbService.db
      .select()
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.id, id));

    if (res.length > 0) {
      return {
        success: true,
        data: res[0],
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Question not found',
    };
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    userId: string,
  ) {
    const userCheckRes = await this.checkIfUserIsOwner(userId, id);
    if (!userCheckRes) {
      return {
        success: false,
        data: null,
        error: 'User is not owner of quiz',
      };
    }
    //check for correct user
    const dbRes = await this.findOne(id);
    if (!dbRes.success) {
      return {
        success: false,
        data: null,
        error: 'Question not found',
      };
    }
    const res = await this.dbService.db
      .update(SimpleQuestionTable)
      .set({
        question: updateQuestionDto.question,
        answer: updateQuestionDto.answer,
        points: updateQuestionDto.points,
      })
      .returning({
        id: SimpleQuestionTable.id,
      })
      .execute();
    if (res.length > 0) {
      return {
        success: true,
        data: res[0].id,
        error: null,
      };
    }
    return {
      success: false,
      data: null,
      error: 'Question was not updated',
    };
  }

  async remove(id: string, userId: string) {
    const userCheckRes = await this.checkIfUserIsOwner(userId, id);
    if (!userCheckRes) {
      return {
        success: false,
        data: null,
        error: 'User is not owner of quiz',
      };
    }
    //check for correct user
    const res = await this.dbService.db
      .delete(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.id, id))
      .returning({
        id: SimpleQuestionTable.id,
      })
      .execute();

    if (res.length > 0) {
      return {
        success: true,
        data: res[0].id,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Question was not deleted',
    };
  }
}
