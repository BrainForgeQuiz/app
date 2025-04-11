import { numeric, text, uuid } from 'drizzle-orm/pg-core';

export const id = uuid().primaryKey().defaultRandom();
export const question = text().notNull();
export const answer = numeric().notNull();
