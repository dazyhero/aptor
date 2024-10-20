import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';
import { PG_CONNECTION } from '@/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/schemas';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm/expressions';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentsService Integration', () => {
  let service: AppointmentsService;
  let db: NodePgDatabase<typeof schema>;
  let rabbitMQService: RabbitMQService;

  const pool = new Pool({
    connectionString: 'postgres://user:password@localhost:5432/test_db', // Update with your test database connection string
  });

  beforeAll(async () => {
    db = drizzle(pool);
    await db.execute(sql`
      TRUNCATE TABLE recommended_reminders, appointments, services, employees, clients, businesses RESTART IDENTITY CASCADE;
    `);

    await db.execute(sql`
      INSERT INTO businesses (name)
      VALUES ('Business A');

      INSERT INTO clients (business_id, last_name, first_name)
      VALUES 
        (1, 'Doe', 'John'),
        (1, 'Smith', 'Jane');

      INSERT INTO employees (business_id, name, calendar)
      VALUES 
        (1, 'David', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":{"start":"09:00","end":"17:00"},"thursday":{"start":"09:00","end":"17:00"},"friday":{"start":"09:00","end":"17:00"},"saturday":null,"sunday":null}'),
        (1, 'Mike', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":{"start":"09:00","end":"17:00"},"thursday":{"start":"09:00","end":"17:00"},"friday":{"start":"09:00","end":"17:00"},"saturday":null,"sunday":null}');

      INSERT INTO services (business_id, name, price, duration)
      VALUES 
        (1, 'Consultation', 100, 60),
        (1, 'Therapy', 150, 90);

      INSERT INTO appointments (business_id, client_id, employee_id, service_id, appointment_date, appointment_end_date)
      VALUES 
        (1, 1, 1, 1, '2024-10-21 10:00:00+00', '2024-10-21 12:00:00+00'),
        (1, 2, 2, 2, '2024-10-22 10:00:00+00', '2024-10-22 12:00:00+00');
    `);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: RabbitMQService,
          useValue: {
            emitEvent: jest.fn(),
          },
        },
        {
          provide: PG_CONNECTION,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  afterAll(async () => {
    await db.execute(sql`
       TRUNCATE TABLE recommended_reminders, appointments, services, employees, clients, businesses RESTART IDENTITY CASCADE
    `);
    await pool.end();
  });

  describe('getAppointment', () => {
    it('should return the appointment when it exists', async () => {
      const appointmentId = 1;

      const result = await service.getAppointment(appointmentId);

      expect(result).toBeDefined();
      expect(result.id).toBe(appointmentId);
    });

    it('should return undefined when the appointment does not exist', async () => {
      const result = await service.getAppointment(999);

      expect(result).toBeUndefined();
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel the appointment without emitting an event if not last minute', async () => {
      const now = new Date();
      const appointmentDate = new Date(now.getTime() + 25 * 60 * 60 * 1000);
      const appointmentEndDate = new Date(
        appointmentDate.getTime() + 60 * 60 * 1000,
      );

      const [appointment] = await db
        .insert(schema.appointments)
        .values({
          businessId: 1,
          clientId: 1,
          employeeId: 1,
          serviceId: 1,
          appointmentDate: appointmentDate,
          appointmentEndDate: appointmentEndDate,
        })
        .returning({ id: schema.appointments.id })
        .execute();

      const cancelDto = {
        clientId: 1,
        appointmentId: appointment.id,
      };

      const result = await service.cancelAppointment(cancelDto);

      expect(result).toEqual({
        message: 'Appointment cancelled successfully.',
      });

      const [updatedAppointment] = await db
        .select()
        .from(schema.appointments)
        .where(eq(schema.appointments.id, appointment.id))
        .execute();

      expect(updatedAppointment.clientId).toBeNull();

      expect(rabbitMQService.emitEvent).not.toHaveBeenCalled();
    });

    it('should cancel the appointment and emit an event if last minute', async () => {
      const now = new Date();
      const appointmentDate = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hours from now
      const appointmentEndDate = new Date(
        appointmentDate.getTime() + 60 * 60 * 1000,
      );

      const [appointment] = await db
        .insert(schema.appointments)
        .values({
          businessId: 1,
          clientId: 1,
          employeeId: 1,
          serviceId: 1,
          appointmentDate: appointmentDate,
          appointmentEndDate: appointmentEndDate,
        })
        .returning({ id: schema.appointments.id })
        .execute();

      const cancelDto = {
        clientId: 1,
        appointmentId: appointment.id,
      };

      const result = await service.cancelAppointment(cancelDto);

      expect(result).toEqual({
        message: 'Appointment cancelled successfully.',
      });

      const [updatedAppointment] = await db
        .select()
        .from(schema.appointments)
        .where(eq(schema.appointments.id, appointment.id))
        .execute();

      expect(updatedAppointment.clientId).toBeNull();

      expect(rabbitMQService.emitEvent).toHaveBeenCalledWith(
        'last_minute_cancellation',
        {
          clientId: 1,
          appointmentId: appointment.id,
        },
      );
    });

    it('should throw NotFoundException if the appointment does not exist', async () => {
      const cancelDto = {
        clientId: 1,
        appointmentId: 999,
      };

      await expect(service.cancelAppointment(cancelDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if the appointment does not belong to the client', async () => {
      const now = new Date();
      const appointmentDate = new Date(now.getTime() + 25 * 60 * 60 * 1000); // 25 hours from now
      const appointmentEndDate = new Date(
        appointmentDate.getTime() + 60 * 60 * 1000,
      );

      const [appointment] = await db
        .insert(schema.appointments)
        .values({
          businessId: 1,
          clientId: 2,
          employeeId: 1,
          serviceId: 1,
          appointmentDate: appointmentDate,
          appointmentEndDate: appointmentEndDate,
        })
        .returning({ id: schema.appointments.id })
        .execute();

      const cancelDto = {
        clientId: 1,
        appointmentId: appointment.id,
      };

      await expect(service.cancelAppointment(cancelDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
