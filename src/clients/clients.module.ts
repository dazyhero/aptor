import { RabbitMQModule } from '@/rabbitmq/rabbitmq.module';
import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule, RabbitMQModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
