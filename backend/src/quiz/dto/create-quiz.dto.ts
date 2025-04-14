import { quizTopicEnum } from '../../db/schema/quiz';

export class CreateQuizDto {
  name: string;
  topic: typeof quizTopicEnum;
  userId: string;
}
