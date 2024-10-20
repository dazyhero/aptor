import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { employees } from './employees';
import { businesses } from './businesses';

export const scheduledReminders = pgTable('scheduled_reminders', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => businesses.id), // FK to businesses
  clientId: integer('client_id').references(() => clients.id), // FK to clients
  employeeId: integer('employee_id').references(() => employees.id), // FK to employees
  messageType: varchar('message_type', { length: 255 }).notNull(),
  reminder: varchar('reminder', { length: 255 }),
  reminderDate: timestamp('reminder_date').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  notifiedAt: timestamp('notified_at'),
});
