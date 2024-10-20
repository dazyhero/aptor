import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class AppointmentDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsInt()
  businessId: number;

  @IsNotEmpty()
  @IsInt()
  clientId: number;

  @IsNotEmpty()
  @IsInt()
  employeeId: number;

  @IsNotEmpty()
  @IsInt()
  serviceId: number;

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsDateString()
  appointmentEndDate: string;
}
