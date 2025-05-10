import { QuizType } from '../../db/schema/quiz';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum({
    HISTORY: 'HISTORY',
    LITERATURE: 'LITERATURE',
  })
  @IsNotEmpty()
  topic: QuizType;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
