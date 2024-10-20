import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@/database/schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, gt, or, lt, not, and, inArray } from 'drizzle-orm';
import { PG_CONNECTION } from '@/constants';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllClientsBut(clientId: number) {
    return this.db
      .select()
      .from(schema.clients)
      .where(not(eq(schema.clients.id, clientId)));
  }

  async getFreeClients({
    appointmentDate,
    appointmentEndDate,
  }: {
    appointmentDate: Date;
    appointmentEndDate: Date;
  }) {
    return this.db
      .selectDistinctOn([schema.clients.id])
      .from(schema.clients)
      .leftJoin(
        schema.appointments,
        eq(schema.clients.id, schema.appointments.clientId),
      )
      .where(
        or(
          eq(schema.appointments.clientId, null),
          not(
            and(
              lt(schema.appointments.appointmentDate, appointmentEndDate),
              gt(schema.appointments.appointmentEndDate, appointmentDate),
            ),
          ),
        ),
      )
      .then((rows) => rows.map(({ clients }) => clients));
  }

  async getActiveRecommendations(clientIds: number[]) {
    return this.db
      .selectDistinctOn([schema.clients.id])
      .from(schema.clients)
      .leftJoin(
        schema.recommendedReminders,
        eq(schema.clients.id, schema.recommendedReminders.clientId),
      )
      .where(
        and(
          inArray(schema.clients.id, clientIds),
          eq(schema.recommendedReminders.status, 'active'),
        ),
      )
      .then((rows) => rows.map(({ clients }) => clients));
  }
}
