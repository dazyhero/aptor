import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';

export const clients = pgTable('clients', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id), // FK to businesses
  lastName: varchar('last_name', { length: 255 }),
  firstName: varchar('first_name', { length: 255 }),
});
