import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const id = uuid().primaryKey().defaultRandom();
export const createdAt = timestamp({ withTimezone: true }).defaultNow();
export const updatedAt = timestamp({ withTimezone: true })
  .defaultNow()
  .defaultNow();
