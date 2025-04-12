import { numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { id } from '../schemaHelper';

const points = numeric().notNull().default('1');
const quizId = text().notNull();
const question = text().notNull();

export const SimpleQuestionTable = pgTable('simple_questions', {
  id,
  question,
  answer: text().notNull(),
  quizId,
  points,
});

export const ChoiceQuestionTable = pgTable('choice_questions', {
  id,
  question,
  option0: text().notNull(),
  option1: text().notNull(),
  option2: text().notNull(),
  option3: text().notNull(),
  correct: numeric().notNull().default('0'),
  quizId,
  points,
});
