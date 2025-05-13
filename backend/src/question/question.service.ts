import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DbService } from '../db/db.service';
import { SimpleQuestionTable } from '../db/schema/question';
import { eq } from 'drizzle-orm';

@Injectable()
export class QuestionService {
  constructor(private readonly dbService: DbService) {}

  create(createQuestionDto: CreateQuestionDto, userId: string) {
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
