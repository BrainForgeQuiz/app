import { quizTopicEnum, quizTypes } from '../../db/schema/quiz';

export class Quiz {
  id: string;
  name: string;
  topic: quizTypes;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    topic: typeof quizTopicEnum,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.topic = topic;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
