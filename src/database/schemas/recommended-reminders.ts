import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { employees } from './employees';
import { businesses } from './businesses';

export const recommendationStatusEnum = pgEnum('recommendation_status', [
  'active',
  'fulfilled',
  'expired',
]);

export const recommendedReminders = pgTable('recommended_reminders', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id), // FK to businesses
  clientId: integer('client_id').references(() => clients.id), // FK to clients
  employeeId: integer('employee_id').references(() => employees.id), // FK to employees
  messageType: varchar('message_type', { length: 255 }).notNull(),
  reminder: varchar('reminder', { length: 255 }),
  reminderDate: timestamp('reminder_date').notNull(),
  status: recommendationStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  notifiedAt: timestamp('notified_at'),
});
