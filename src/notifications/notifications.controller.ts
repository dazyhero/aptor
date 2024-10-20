import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RecommendationCreatedDto } from '@/recommendations/dto/recommendation-created.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('recommendation_created')
  sendNotification(@Payload() createdRecommendation: RecommendationCreatedDto) {
    this.notificationsService.sendNotification(createdRecommendation);
  }
}
