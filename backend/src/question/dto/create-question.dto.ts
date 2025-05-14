import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  points: number;
}
