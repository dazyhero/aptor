import { recommendationStatusEnum } from '@/database/schemas';
import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class RecommendationDto {
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
  reminderDate: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  reminder: string;

  @IsNotEmpty()
  @IsEnum(recommendationStatusEnum)
  status: typeof recommendationStatusEnum;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsDateString()
  notifiedAt?: string;
}
