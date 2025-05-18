import { IsString, IsNotEmpty } from 'class-validator';

export class StartGameDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;
}
