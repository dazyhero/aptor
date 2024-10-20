import { ClientsModule } from '@/clients/clients.module';
import { Module } from '@nestjs/common';
import { ClientMatchingService } from './client-matching.service';
import { ClientMatchingController } from './client-matching.controller';
import { PredictionModelModule } from '@/prediction-model/prediction-model.module';
import { AppointmentsModule } from '@/appointments/appointments.module';
import { RabbitMQModule } from '@/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ClientsModule,
    PredictionModelModule,
    AppointmentsModule,
    RabbitMQModule,
  ],
  controllers: [ClientMatchingController],
  providers: [ClientMatchingService],
})
export class ClientMatchingModule {}
