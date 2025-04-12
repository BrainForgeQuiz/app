import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelper';

export const quizTopicEnum = pgEnum('quiz_type', ['HISTORY', 'LITERATURE']);

export const QuizTable = pgTable('quizzes', {
  id,
  name: text().notNull(),
  topic: quizTopicEnum().notNull(),
  createdAt,
  updatedAt,
});
