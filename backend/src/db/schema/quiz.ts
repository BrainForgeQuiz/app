import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelper';
import { UserTable } from './user';

export const quizTypes = ['HISTORY', 'LITERATURE'] as const;

export type QuizType = (typeof quizTypes)[number];

export const quizTopicEnum = pgEnum('quiz_type', quizTypes);

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
