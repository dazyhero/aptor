import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientMatchingService } from './client-matching.service';
import { CancelAppointmentDto } from '@/appointments/dto/cancel-appointment.dto';

@Controller('client-matching')
export class ClientMatchingController {
  constructor(private readonly clientMatchingService: ClientMatchingService) {}

  @EventPattern('last_minute_cancellation')
  matchClient(@Payload() cancellation: CancelAppointmentDto) {
    this.clientMatchingService.matchClient(cancellation);
  }
}
