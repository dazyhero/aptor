import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm/expressions';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import * as schema from '@/database/schemas';
import { PG_CONNECTION } from '@/constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(PG_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async getAppointment(appointmentId: number) {
    return this.db
      .select()
      .from(schema.appointments)
      .where(eq(schema.appointments.id, appointmentId))
      .then((rows) => rows[0]);
  }

  async cancelAppointment({ clientId, appointmentId }: CancelAppointmentDto) {
    const appointment = await this.db
      .select()
      .from(schema.appointments)
      .where(
        and(
          eq(schema.appointments.id, appointmentId),
          eq(schema.appointments.clientId, clientId),
        ),
      )
      .then((rows) => rows[0]);

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    const appointmentDate = new Date(appointment.appointmentDate.toString());
    const now = new Date();
    const timeDifference = appointmentDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    const lastMinuteThreshold = 24;
    const isLastMinute = hoursDifference < lastMinuteThreshold;

    await this.db
      .update(schema.appointments)
      .set({ clientId: null })
      .where(eq(schema.appointments.id, appointmentId));

    if (isLastMinute) {
      await this.rabbitMQService.emitEvent('last_minute_cancellation', {
        clientId,
        appointmentId,
      });
    }

    return {
      message: 'Appointment cancelled successfully.',
    };
  }
}
