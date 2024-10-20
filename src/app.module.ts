import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PredictionModelModule } from './prediction-model/prediction-model.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ClientsModule } from './clients/clients.module';
import { ClientMatchingModule } from './client-matching/client-matching.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { WebHookModule } from './web-hook/web-hook.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PredictionModelModule,
    RabbitMQModule,
    ClientsModule,
    RecommendationsModule,
    ClientMatchingModule,
    RecommendationsModule,
    WebHookModule,
    AppointmentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
