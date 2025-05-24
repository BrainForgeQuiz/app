import { integer, numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelper';

export const UserTable = pgTable('users', {
  id,
  username: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  createdAt,
  updatedAt,
  points: integer().notNull().default(0),
});
