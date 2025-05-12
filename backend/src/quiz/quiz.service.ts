import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import Response from '../responses/response';
import { DbService } from '../db/db.service';
import { QuizTable } from '../db/schema/quiz';
import { eq } from 'drizzle-orm';

@Injectable()
export class QuizService {
  constructor(private readonly dbService: DbService) {}

  async create(createQuizDto: CreateQuizDto): Promise<Response> {
    //TODO check if quiz exists
    const res: { id: string }[] = await this.dbService.db
      .insert(QuizTable)
      .values({
        name: createQuizDto.name,
        topic: createQuizDto.topic,
        userId: createQuizDto.userId,
      })
      .returning({ id: QuizTable.id })
      .execute();
    return {
      success: true,
      data: res[0].id,
      error: null,
    };
  }

  findAll() {
    return `This action returns all quiz`;
  }

  async findOne(id: string) {
    const res = await this.dbService.db
      .select()
      .from(QuizTable)
      .where(eq(QuizTable.id, id));
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

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
