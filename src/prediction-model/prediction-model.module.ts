import { Module } from '@nestjs/common';
import { PredictionModelService } from './prediction-model.service';
import { ClientsModule } from '@/clients/clients.module';

@Module({
  imports: [ClientsModule],
  providers: [PredictionModelService],
  exports: [PredictionModelService],
})
export class PredictionModelModule {}
