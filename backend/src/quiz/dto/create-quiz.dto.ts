import { QuizType } from '../../db/schema/quiz';

export class CreateQuizDto {
  name: string;
  topic: QuizType;
  userId: string;
}
