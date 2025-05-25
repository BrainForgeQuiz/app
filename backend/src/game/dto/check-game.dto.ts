import { IsString, IsNotEmpty } from 'class-validator';

export class CheckGameDto {
  @IsString()
  @IsNotEmpty()
  gameState: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
