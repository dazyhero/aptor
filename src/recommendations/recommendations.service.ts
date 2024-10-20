import { PG_CONNECTION } from '@/constants';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/schemas';
import { ClientsMatchedDto } from '@/client-matching/dto/clients-matched.dto';
import { InferInsertModel } from 'drizzle-orm';

type i = InferInsertModel<typeof schema.recommendedReminders>;

@Injectable()
export class RecommendationsService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createRecommendation({
    matchedClients,
    appointment,
  }: ClientsMatchedDto) {
    const recommendations = matchedClients.map((client) => {
      return {
        businessId: appointment.businessId,
        clientId: client.id,
        employeeId: appointment.employeeId,
        messageType: 'Email',
        status: 'active' as i['status'],
        createdAt: new Date(),
        reminderDate: new Date(appointment.appointmentDate),
      };
    });

    return this.db.insert(schema.recommendedReminders).values(recommendations);
  }
}
