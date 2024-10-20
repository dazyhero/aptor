import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { employees } from './employees';
import { businesses } from './businesses';
import { services } from './services';

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .notNull()
    .references(() => businesses.id), // FK to businesses
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id), // FK to clients
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employees.id), // FK to employees
  serviceId: integer('service_id')
    .notNull()
    .references(() => services.id), // FK to services
  appointmentDate: timestamp('appointment_date').notNull(),
  appointmentEndDate: timestamp('appointment_end_date').notNull(),
});
