import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { RecommendationDto } from './recommendation.dto';
import { Recommendation } from '../recommendations.type';

export class RecommendationCreatedDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecommendationDto)
  recommendations: Recommendation[];
}
