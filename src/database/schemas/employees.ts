import { pgTable, serial, integer, varchar, json } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id),
  name: varchar('name', { length: 255 }).notNull(),
  calendar: json('calendar').notNull(),
});
