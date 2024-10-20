import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CancelAppointmentDto } from '@/appointments/dto/cancel-appointment.dto';
import { AppointmentsService } from '@/appointments/appointments.service';

@Controller('web-hook')
export class WebHookController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('cancel-appointment')
  async cancelAppointment(@Body() cancelAppointmentDto: CancelAppointmentDto) {
    try {
      const result =
        await this.appointmentsService.cancelAppointment(cancelAppointmentDto);
      return result;
    } catch (error) {
      if (error.status && error.response) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while cancelling the appointment.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
