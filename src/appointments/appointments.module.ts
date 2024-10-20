import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { RabbitMQModule } from '@/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, RabbitMQModule],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
