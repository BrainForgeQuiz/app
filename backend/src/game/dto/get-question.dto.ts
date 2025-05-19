import { IsString, IsNotEmpty } from 'class-validator';

export class GetQuestionDto {
  @IsString()
  @IsNotEmpty()
  gameState: string;
}
