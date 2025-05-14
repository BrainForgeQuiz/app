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

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    const userCheck = await this.dbService.db
      .select({
        id: QuizTable.userId,
      })
      .from(QuizTable)
      .where(eq(QuizTable.id, createQuestionDto.quizId));
    if (userCheck.length === 0) {
      return {
        success: false,
        data: null,
        error: 'Quiz not found',
      };
    }

    if (userCheck[0].id !== userId) {
      return {
        success: false,
        data: null,
        error: 'You are not the owner of this quiz',
      };
    }

    const res = await this.dbService.db.insert(SimpleQuestionTable).values({
      question: createQuestionDto.question,
      answer: createQuestionDto.answer,
      quizId: createQuestionDto.quizId,
      points: createQuestionDto.points,
    });

    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  async findOne(id: string) {
    const res = this.dbService.db
      .select()
      .from(SimpleQuestionTable)
      .where(eq(SimpleQuestionTable.id, id));
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
