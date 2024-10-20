import { ClientsService } from '@/clients/clients.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PredictionModelService {
  constructor(private readonly clientService: ClientsService) {}

  async getPrediction(clientId: number) {
    return this.clientService.getAllClientsBut(clientId);
  }
}
