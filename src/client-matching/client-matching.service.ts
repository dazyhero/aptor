import { AppointmentsService } from '@/appointments/appointments.service';
import { CancelAppointmentDto } from '@/appointments/dto/cancel-appointment.dto';
import { ClientsService } from '@/clients/clients.service';
import { PredictionModelService } from '@/prediction-model/prediction-model.service';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientMatchingService {
  constructor(
    private readonly predtionModelService: PredictionModelService,
    private readonly clientService: ClientsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async matchClient(cancellation: CancelAppointmentDto) {
    const { clientId, appointmentId } = cancellation;

    const clients = await this.predtionModelService.getPrediction(clientId);

    const appointment =
      await this.appointmentsService.getAppointment(appointmentId);

    if (!appointment) {
      return;
    }

    const availableClients = await this.clientService.getFreeClients({
      appointmentDate: appointment.appointmentDate,
      appointmentEndDate: appointment.appointmentEndDate,
    });

    if (!availableClients) {
      return;
    }

    const matchedClients = clients.filter(({ id }) =>
      availableClients.some((client) => client.id === id),
    );

    const clientsActiveRecommendations =
      await this.clientService.getActiveRecommendations(
        matchedClients.map(({ id }) => id),
      );

    const clientsWithoutRecommendations = matchedClients.filter(
      ({ id }) =>
        !clientsActiveRecommendations.some((client) => client.id === id),
    );

    if (!clientsWithoutRecommendations.length) {
      return;
    }

    this.rabbitMQService.emitEvent('clients_matched', {
      matchedClients: clientsWithoutRecommendations,
      appointment,
    });
  }
}
