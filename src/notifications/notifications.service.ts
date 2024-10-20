import { RecommendationCreatedDto } from '@/recommendations/dto/recommendation-created.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor() {}

  async sendNotification(createdRecommendation: RecommendationCreatedDto) {
    // Send notification
  }
}
