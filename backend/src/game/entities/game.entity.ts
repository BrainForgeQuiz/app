export class Game {
  id: string;
  userId: string;
  quizId: string;
  listOfQuestions: QuestionSendBack[];
}

class QuestionSendBack {
  id: string;
  trys: number;
  score: number;
}
