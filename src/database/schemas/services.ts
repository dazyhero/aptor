import { pgTable, serial, varchar, integer, json } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id), // FK to businesses
  name: varchar('name', { length: 255 }).notNull(),
  price: integer('price'),
  duration: integer('duration').notNull(), // Assuming in minutes
});
