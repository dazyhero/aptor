import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  appointmentId: number;
}
