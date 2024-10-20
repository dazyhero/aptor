import { ClientsMatchedDto } from '@/client-matching/dto/clients-matched.dto';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RecommendationsService } from './recommendations.service';

@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @EventPattern('clients_matched')
  createRecommendation(@Payload() clientsMatched: ClientsMatchedDto) {
    this.recommendationsService.createRecommendation(clientsMatched);
  }
}
