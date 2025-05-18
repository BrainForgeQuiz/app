export class Game {
  constructor(
    userId: string,
    quizId: string,
    listOfQuestions: QuestionSendBack[],
  ) {
    this.userId = userId;
    this.quizId = quizId;
    this.listOfQuestions = listOfQuestions;
  }

  userId: string;
  quizId: string;
  listOfQuestions: QuestionSendBack[];
}

export class QuestionSendBack {
  id: string;
  trys: number;
  score: number;
}
