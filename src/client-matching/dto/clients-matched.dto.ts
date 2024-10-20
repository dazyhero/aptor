import { Appointment } from '@/appointments/appointments.type';
import { AppointmentDto } from '@/appointments/dto/appointment.dto';
import { Client } from '@/clients/clients.type';
import { ClientDto } from '@/clients/dto/client.dto';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class ClientsMatchedDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  matchedClients: Client[];

  @IsNotEmpty()
  @Type(() => AppointmentDto)
  appointment: Appointment;
}
