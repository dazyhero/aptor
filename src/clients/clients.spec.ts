import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PG_CONNECTION } from '@/constants';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/schemas';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

describe('ClientsService (Integration)', () => {
  let service: ClientsService;
  let db: NodePgDatabase<typeof schema>;

  const pool = new Pool({
    connectionString: 'postgres://user:password@localhost:5432/test_db',
  });

  beforeAll(async () => {
    db = drizzle(pool);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PG_CONNECTION,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);

    await db.execute(sql`
      TRUNCATE clients, appointments, recommended_reminders, employees, businesses, services RESTART IDENTITY CASCADE;

      INSERT INTO businesses (id, name)
      VALUES (1, 'Business A');

      INSERT INTO clients (business_id, last_name, first_name)
      VALUES 
        (1, 'Doe', 'John'),
        (1, 'Smith', 'Jane');

      INSERT INTO employees (id, business_id, name)
      VALUES 
        (1, 1, 'David'),
        (2, 1, 'Mike');

      INSERT INTO services (id, business_id, name, price, duration)
      VALUES 
        (1, 1, 'Consultation', 100, 60),
        (2, 1, 'Therapy', 150, 90);

      INSERT INTO appointments (business_id, client_id, employee_id, service_id, appointment_date, appointment_end_date)
      VALUES 
        (1, 1, 1, 1, '2024-10-20 10:00:00', '2024-10-20 12:00:00'),
        (1, 2, 2, 2, '2024-10-21 10:00:00', '2024-10-21 12:00:00');

      INSERT INTO recommended_reminders (client_id, status, message_type, reminder_date, created_at)
      VALUES 
        (1, 'active', 'email', '2024-10-20 09:00:00', CURRENT_TIMESTAMP),
        (1, 'fulfilled', 'sms', '2024-10-19 09:00:00', CURRENT_TIMESTAMP),
        (2, 'expired', 'email', '2024-10-18 09:00:00', CURRENT_TIMESTAMP);
    `);
  });

  afterAll(async () => {
    await db.execute(sql`
       TRUNCATE clients, appointments, recommended_reminders, employees, businesses, services RESTART IDENTITY CASCADE;
    `);
    await pool.end();
  });

  describe('getFreeClients', () => {
    it('should return clients who are free for a given appointment time', async () => {
      const appointmentDate = new Date('2024-10-20T13:00:00.000Z'); // Check for free clients from this time
      const appointmentEndDate = new Date('2024-10-20T14:00:00.000Z');

      const result = await service.getFreeClients({
        appointmentDate,
        appointmentEndDate,
      });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
          }),
        ]),
      );
    });

    it('should return an empty array if no clients are free', async () => {
      await db.execute(sql`
        TRUNCATE appointments RESTART IDENTITY CASCADE;

        INSERT INTO appointments (business_id, client_id, employee_id, service_id, appointment_date, appointment_end_date)
        VALUES 
          (1, 1, 1, 1, '2024-10-20 10:00:00', '2024-10-20 12:00:00');
      `);

      const appointmentDate = new Date('2024-10-20T11:00:00.000Z');
      const appointmentEndDate = new Date('2024-10-20T12:30:00.000Z');

      const result = await service.getFreeClients({
        appointmentDate,
        appointmentEndDate,
      });

      expect(result).toEqual([]);
    });
  });

  describe('getActiveRecommendations', () => {
    it('should return the active recommendation for a specific client', async () => {
      const result = await service.getActiveRecommendations([1]);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
          }),
        ]),
      );
    });

    it('should return no recommendations if the client has no active recommendations', async () => {
      const result = await service.getActiveRecommendations([2]);

      expect(result).toEqual([]);
    });

    it('should return no recommendations for fulfilled or expired reminders', async () => {
      const resultFulfilled = await service.getActiveRecommendations([1]);

      expect(resultFulfilled).not.toEqual(
        expect.arrayContaining([{ client_id: 1, status: 'fulfilled' }]),
      );

      const resultExpired = await service.getActiveRecommendations([2]);

      expect(resultExpired).toEqual([]);
    });
    it('should return active recommendations for multiple clients', async () => {
      const result = await service.getActiveRecommendations([1, 2]);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
          }),
        ]),
      );
    });
  });
});
