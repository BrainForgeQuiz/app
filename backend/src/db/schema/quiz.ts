import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelper';
import { UserTable } from './user';

export const quizTopicEnum = pgEnum('quiz_type', ['HISTORY', 'LITERATURE']);

export const QuizTable = pgTable('quizzes', {
  id,
  name: text().notNull(),
  topic: quizTopicEnum().notNull(),
  userId: uuid()
    .references(() => UserTable.id)
    .notNull(),
  createdAt,
  updatedAt,
});
