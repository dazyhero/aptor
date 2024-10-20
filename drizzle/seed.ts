import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://user:password@localhost:5432/cancellation',
});

const db = drizzle(pool);

async function seed() {
  await db.execute(sql`
    INSERT INTO businesses (id, name) VALUES
    (1, 'Alpha Salon'),
    (2, 'Beta Spa');

    INSERT INTO clients (id, business_id, first_name, last_name) VALUES
    (1, 1, 'John', 'Doe'),
    (2, 1, 'Jane', 'Smith'),
    (3, 2, 'Alice', 'Johnson'),
    (4, 2, 'Bob', 'Williams'),
    (5, 2, 'Carol', 'Brown');

    INSERT INTO employees (id, business_id, name, calendar) VALUES
    (1, 1, 'Employee 1', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (2, 1, 'Employee 2', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (3, 1, 'Employee 3', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (4, 1, 'Employee 4', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (5, 1, 'Employee 5', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (6, 2, 'Employee 6', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (7, 2, 'Employee 7', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (8, 2, 'Employee 8', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (9, 2, 'Employee 9', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }'),
    (10, 2, 'Employee 10', '{
      "monday": {"start": "09:00", "end": "17:00"},
      "tuesday": {"start": "09:00", "end": "17:00"},
      "wednesday": {"start": "09:00", "end": "17:00"},
      "thursday": {"start": "09:00", "end": "17:00"},
      "friday": {"start": "09:00", "end": "17:00"},
      "saturday": {"start": null, "end": null},
      "sunday": {"start": null, "end": null}
    }');

    INSERT INTO services (id, business_id, name, price, duration) VALUES
    (1, 1, 'Haircut', 30, 30),
    (2, 1, 'Hair Coloring', 60, 60),
    (3, 2, 'Massage', 80, 90),
    (4, 2, 'Facial', 50, 60);

    INSERT INTO appointments (business_id, client_id, employee_id, service_id, appointment_date, appointment_end_date) VALUES
    (1, 1, 1, 1, '2024-10-21 07:00:00', '2024-10-21 09:30:00'),
    (1, 2, 2, 2, '2024-10-21 10:00:00', '2024-10-21 11:00:00'),
    (1, 1, 3, 1, '2024-10-22 09:30:00', '2024-10-22 10:00:00'),
    (1, 2, 4, 2, '2024-10-22 11:00:00', '2024-10-22 12:00:00'),
    (1, 1, 5, 1, '2024-10-23 09:00:00', '2024-10-23 09:30:00'),
    (1, 2, 1, 2, '2024-10-23 10:00:00', '2024-10-23 11:00:00'),
    (1, 1, 2, 1, '2024-10-24 09:30:00', '2024-10-24 10:00:00'),
    (1, 2, 3, 2, '2024-10-24 11:00:00', '2024-10-24 12:00:00'),
    (1, 1, 4, 1, '2024-10-25 09:00:00', '2024-10-25 09:30:00'),
    (1, 2, 5, 2, '2024-10-25 10:00:00', '2024-10-25 11:00:00'),
    (1, 1, 1, 1, '2024-10-28 09:30:00', '2024-10-28 10:00:00'),
    (1, 2, 2, 2, '2024-10-28 11:00:00', '2024-10-28 12:00:00'),
    (1, 1, 3, 1, '2024-10-29 09:00:00', '2024-10-29 09:30:00'),
    (1, 2, 4, 2, '2024-10-29 10:00:00', '2024-10-29 11:00:00'),
    (1, 1, 5, 1, '2024-10-30 09:30:00', '2024-10-30 10:00:00'),
    (1, 2, 1, 2, '2024-10-30 11:00:00', '2024-10-30 12:00:00'),
    (1, 1, 2, 1, '2024-10-31 09:00:00', '2024-10-31 09:30:00'),
    (1, 2, 3, 2, '2024-10-31 10:00:00', '2024-10-31 11:00:00'),
    (1, 1, 4, 1, '2024-11-01 09:30:00', '2024-11-01 10:00:00'),
    (1, 2, 5, 2, '2024-11-01 11:00:00', '2024-11-01 12:00:00'),
    (1, 1, 1, 1, '2024-11-04 09:00:00', '2024-11-04 09:30:00'),
    (1, 2, 2, 2, '2024-11-04 10:00:00', '2024-11-04 11:00:00'),
    (1, 1, 3, 1, '2024-11-05 09:30:00', '2024-11-05 10:00:00'),
    (1, 2, 4, 2, '2024-11-05 11:00:00', '2024-11-05 12:00:00'),
    (1, 1, 5, 1, '2024-11-06 09:00:00', '2024-11-06 09:30:00');

    INSERT INTO appointments (business_id, client_id, employee_id, service_id, appointment_date, appointment_end_date) VALUES
    (2, 3, 6, 3, '2024-10-21 09:00:00', '2024-10-21 10:30:00'),
    (2, 4, 7, 4, '2024-10-21 11:00:00', '2024-10-21 12:00:00'),
    (2, 5, 8, 3, '2024-10-22 09:30:00', '2024-10-22 11:00:00'),
    (2, 3, 9, 4, '2024-10-22 11:30:00', '2024-10-22 12:30:00'),
    (2, 4, 10, 3, '2024-10-23 09:00:00', '2024-10-23 10:30:00'),
    (2, 5, 6, 4, '2024-10-23 11:00:00', '2024-10-23 12:00:00'),
    (2, 3, 7, 3, '2024-10-24 09:30:00', '2024-10-24 11:00:00'),
    (2, 4, 8, 4, '2024-10-24 11:30:00', '2024-10-24 12:30:00'),
    (2, 5, 9, 3, '2024-10-25 09:00:00', '2024-10-25 10:30:00'),
    (2, 3, 10, 4, '2024-10-25 11:00:00', '2024-10-25 12:00:00'),
    (2, 4, 6, 3, '2024-10-28 09:00:00', '2024-10-28 10:30:00'),
    (2, 5, 7, 4, '2024-10-28 11:00:00', '2024-10-28 12:00:00'),
    (2, 3, 8, 3, '2024-10-29 09:30:00', '2024-10-29 11:00:00'),
    (2, 4, 9, 4, '2024-10-29 11:30:00', '2024-10-29 12:30:00'),
    (2, 5, 10, 3, '2024-10-30 09:00:00', '2024-10-30 10:30:00'),
    (2, 3, 6, 4, '2024-10-30 11:00:00', '2024-10-30 12:00:00'),
    (2, 4, 7, 3, '2024-10-31 09:30:00', '2024-10-31 11:00:00'),
    (2, 5, 8, 4, '2024-10-31 11:30:00', '2024-10-31 12:30:00'),
    (2, 3, 9, 3, '2024-11-01 09:00:00', '2024-11-01 10:30:00'),
    (2, 4, 10, 4, '2024-11-01 11:00:00', '2024-11-01 12:00:00'),
    (2, 5, 6, 3, '2024-11-04 09:00:00', '2024-11-04 10:30:00'),
    (2, 3, 7, 4, '2024-11-04 11:00:00', '2024-11-04 12:00:00'),
    (2, 4, 8, 3, '2024-11-05 09:30:00', '2024-11-05 11:00:00'),
    (2, 5, 9, 4, '2024-11-05 11:30:00', '2024-11-05 12:30:00'),
    (2, 3, 10, 3, '2024-11-06 09:00:00', '2024-11-06 10:30:00');

    INSERT INTO scheduled_reminders (business_id, client_id, employee_id, message_type, reminder, reminder_date, status, notified_at) VALUES
    (1, 1, 1, 'Email', 'Your appointment is scheduled for tomorrow.', '2024-10-20 09:00:00', 'Scheduled', NULL),
    (2, 3, 6, 'SMS', 'Reminder: Your spa session is tomorrow.', '2024-10-20 09:00:00', 'Scheduled', NULL);

    INSERT INTO recommended_reminders (business_id, client_id, employee_id, message_type, reminder, reminder_date, status, created_at, updated_at, notified_at) VALUES
    (1, 2, 2, 'Email', 'Time for your next haircut!', '2024-11-20 10:00:00', 'active', '2024-10-20 10:00:00', NULL, NULL),
    (2, 4, 7, 'SMS', 'We recommend a deep tissue massage.', '2024-11-21 09:00:00', 'active', '2024-10-21 09:00:00', NULL, NULL); 
  `);
  console.info('Seeding complete');
}

seed()
  .then(() => pool.end())
  .catch((error) => {
    console.error(error);
  });
