import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import Response from '../responses/response';
import { DbService } from '../db/db.service';
import { QuizTable } from '../db/schema/quiz';
import { eq } from 'drizzle-orm';
import { SimpleQuestionTable } from '../db/schema/question';

@Injectable()
export class QuizService {
  constructor(private readonly dbService: DbService) {}

  async create(
    createQuizDto: CreateQuizDto,
    userId: string,
  ): Promise<Response> {
    //TODO check if quiz exists
    const dbCheck = await this.findOneByName(createQuizDto.name);
    if (dbCheck.data) {
      return {
        success: false,
        data: null,
        error: 'Quiz already exists',
      };
    }
    //Saving
    const res: { id: string }[] = await this.dbService.db
      .insert(QuizTable)
      .values({
        name: createQuizDto.name,
        topic: createQuizDto.topic,
        userId: userId,
      })
      .returning({ id: QuizTable.id })
      .execute();
    return {
      success: true,
      data: res[0].id,
      error: null,
    };
  }

  async findAll() {
    return await this.dbService.db
      .select({
        id: QuizTable.id,
        name: QuizTable.name,
        topic: QuizTable.topic,
        userId: QuizTable.userId,
      })
      .from(QuizTable)
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
          error: 'Error fetching quizzes',
        };
      });
  }

  async findOne(id: string) {
    const res = await this.dbService.db
      .select({
        id: QuizTable.id,
        name: QuizTable.name,
        topic: QuizTable.topic,
        userId: QuizTable.userId,
      })
      .from(QuizTable)
      .where(eq(QuizTable.id, id));

    const questionCount = await this.dbService.db
      .select({
        id: SimpleQuestionTable.id,
      })
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.quizId, id));
    if (res.length > 0) {
      return {
        success: true,
        data: { ...res[0], questionCount: questionCount.length },
        error: null,
      };
    }
    return {
      success: true,
      data: false,
      error: 'Quiz not found',
    };
  }

  async findOneByName(name: string) {
    const res = await this.dbService.db
      .select({
        id: QuizTable.id,
        name: QuizTable.name,
        topic: QuizTable.topic,
        userId: QuizTable.userId,
      })
      .from(QuizTable)
      .where(eq(QuizTable.name, name));
    if (res.length > 0) {
      return {
        success: true,
        data: res[0],
        error: null,
      };
    }
    return {
      success: true,
      data: false,
      error: 'Quiz not found',
    };
  }

  async findOneByUserId(userId: string) {
    const res = await this.dbService.db
      .select({
        id: QuizTable.id,
        name: QuizTable.name,
        topic: QuizTable.topic,
        userId: QuizTable.userId,
      })
      .from(QuizTable)
      .where(eq(QuizTable.userId, userId));
    if (res.length > 0) {
      return {
        success: true,
        data: res,
        error: null,
      };
    }
    return {
      success: true,
      data: false,
      error: 'Quiz not found',
    };
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, userId: string) {
    const dbRes = await this.findOne(id);

    if (!dbRes) {
      return {
        success: false,
        data: null,
        error: 'Quiz not found',
      };
    }
    if (typeof dbRes.data === 'boolean') {
      return {
        success: false,
        data: null,
        error: 'Quiz not found',
      };
    }
    if (dbRes.data.userId !== userId) {
      return {
        success: false,
        data: null,
        error: 'You are not the owner of this quiz',
      };
    }

    dbRes.data.topic = updateQuizDto.topic
      ? updateQuizDto.topic
      : dbRes.data.topic;
    dbRes.data.name = updateQuizDto.name ? updateQuizDto.name : dbRes.data.name;

    const res = await this.dbService.db
      .update(QuizTable)
      .set({
        name: dbRes.data.name,
        topic: dbRes.data.topic,
      })
      .where(eq(QuizTable.id, id))
      .returning({ id: QuizTable.id })
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
      error: 'Error updating quiz',
    };
  }

  async remove(id: string, userId: string) {
    const res = await this.findOne(id);
    if (!res) {
      return {
        success: false,
        data: null,
        error: 'Quiz not found',
      };
    }
    if (typeof res.data === 'boolean') {
      return {
        success: false,
        data: null,
        error: 'Quiz not found',
      };
    }
    if (res.data.userId !== userId) {
      return {
        success: false,
        data: null,
        error: 'You are not the owner of this quiz',
      };
    }
    const questionRes = await this.dbService.db
      .delete(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.quizId, id))
      .returning({ id: SimpleQuestionTable.id })
      .execute();
    if (questionRes.length > 0) {
      console.log('Deleted questions:', questionRes);
    } else console.log('No questions to delete for quiz:', id);
    const dbRes = await this.dbService.db
      .delete(QuizTable)
      .where(eq(QuizTable.id, id))
      .returning({ id: QuizTable.id })
      .execute();
    if (dbRes.length > 0) {
      return {
        success: true,
        data: dbRes[0].id,
        error: null,
      };
    }
    return {
      success: false,
      data: null,
      error: 'Error deleting quiz',
    };
  }
}
