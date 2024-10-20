import { Test, TestingModule } from '@nestjs/testing';
import { ClientMatchingService } from './client-matching.service';
import { PredictionModelService } from '@/prediction-model/prediction-model.service';
import { ClientsService } from '@/clients/clients.service';
import { AppointmentsService } from '@/appointments/appointments.service';
import { RabbitMQService } from '@/rabbitmq/rabbitmq.service';

describe('ClientMatchingService', () => {
  let service: ClientMatchingService;
  let predictionModelService: PredictionModelService;
  let clientsService: ClientsService;
  let appointmentsService: AppointmentsService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientMatchingService,
        {
          provide: PredictionModelService,
          useValue: {
            getPrediction: jest.fn(),
          },
        },
        {
          provide: ClientsService,
          useValue: {
            getFreeClients: jest.fn(),
            getActiveRecommendations: jest.fn(),
          },
        },
        {
          provide: AppointmentsService,
          useValue: {
            getAppointment: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            emitEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientMatchingService>(ClientMatchingService);
    predictionModelService = module.get<PredictionModelService>(
      PredictionModelService,
    );
    clientsService = module.get<ClientsService>(ClientsService);
    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should do nothing if the appointment does not exist', async () => {
    appointmentsService.getAppointment = jest.fn().mockResolvedValue(null);

    await service.matchClient({ clientId: 1, appointmentId: 1 });

    expect(clientsService.getFreeClients).not.toHaveBeenCalled();
    expect(clientsService.getActiveRecommendations).not.toHaveBeenCalled();
    expect(rabbitMQService.emitEvent).not.toHaveBeenCalled();
  });

  it('should do nothing if there are no available clients', async () => {
    const appointment = {
      appointmentDate: new Date(),
      appointmentEndDate: new Date(),
    };
    appointmentsService.getAppointment = jest
      .fn()
      .mockResolvedValue(appointment);
    predictionModelService.getPrediction = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);
    clientsService.getFreeClients = jest.fn().mockResolvedValue(null);

    await service.matchClient({ clientId: 1, appointmentId: 1 });

    expect(clientsService.getFreeClients).toHaveBeenCalledWith({
      appointmentDate: appointment.appointmentDate,
      appointmentEndDate: appointment.appointmentEndDate,
    });
    expect(rabbitMQService.emitEvent).not.toHaveBeenCalled();
  });

  it('should do nothing if no clients are matched', async () => {
    const appointment = {
      appointmentDate: new Date(),
      appointmentEndDate: new Date(),
    };
    appointmentsService.getAppointment = jest
      .fn()
      .mockResolvedValue(appointment);
    predictionModelService.getPrediction = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);
    clientsService.getFreeClients = jest.fn().mockResolvedValue([{ id: 2 }]);

    await service.matchClient({ clientId: 1, appointmentId: 1 });

    expect(rabbitMQService.emitEvent).not.toHaveBeenCalled();
  });

  it('should do nothing if all matched clients have active recommendations', async () => {
    const appointment = {
      appointmentDate: new Date(),
      appointmentEndDate: new Date(),
    };
    appointmentsService.getAppointment = jest
      .fn()
      .mockResolvedValue(appointment);
    predictionModelService.getPrediction = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);
    clientsService.getFreeClients = jest.fn().mockResolvedValue([{ id: 1 }]);
    clientsService.getActiveRecommendations = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);

    await service.matchClient({ clientId: 1, appointmentId: 1 });

    expect(rabbitMQService.emitEvent).not.toHaveBeenCalled();
  });

  it('should emit an event if matched clients do not have active recommendations', async () => {
    const appointment = {
      appointmentDate: new Date(),
      appointmentEndDate: new Date(),
    };
    appointmentsService.getAppointment = jest
      .fn()
      .mockResolvedValue(appointment);
    predictionModelService.getPrediction = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);
    clientsService.getFreeClients = jest.fn().mockResolvedValue([{ id: 1 }]);
    clientsService.getActiveRecommendations = jest.fn().mockResolvedValue([]);

    await service.matchClient({ clientId: 1, appointmentId: 1 });

    expect(rabbitMQService.emitEvent).toHaveBeenCalledWith('clients_matched', {
      matchedClients: [{ id: 1 }],
      appointment,
    });
  });
});
