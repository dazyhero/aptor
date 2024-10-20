import { RabbitMQModule } from '@/rabbitmq/rabbitmq.module';
import { Module } from '@nestjs/common';
import { WebHookController } from './web-hook.controller';
import { AppointmentsModule } from '@/appointments/appointments.module';

@Module({
  imports: [RabbitMQModule, AppointmentsModule],
  controllers: [WebHookController],
})
export class WebHookModule {}
