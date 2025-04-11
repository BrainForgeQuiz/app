import { pgTable, text } from 'drizzle-orm/pg-core';
import { id } from '../schemaHelper';

export const UserTable = pgTable('users', {
  id,
  username: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  createdAt: text().notNull(),
  updatedAt: text().notNull(),
});
