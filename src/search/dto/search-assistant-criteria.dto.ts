import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export const criteriaDTO = z
  .object({
    maxPrice: z.number(),
    flexibleMaxPrice: z.boolean(),
    originLocationCode: z.string(),
    numberOfPeople: z.number().min(1),
    adults: z.number().min(1),
    children: z.number().optional(),
    destinationLocation: z.boolean(),
    destinationLocationCode: z.string().optional(),
    continent: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    travelType: z.string(),
    travelGenre: z.string(),
    activityPace: z.string(),
    keywords: z.string(),
  })
  .strict();

export class assistantCriteriaDto extends createZodDto(criteriaDTO) {
  @Type(() => Number)
  @IsInt()
  maxPrice: number;

  @IsBoolean()
  flexibleMaxPrice: boolean;

  @IsString()
  originLocationCode: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfPeople: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  children?: number;

  @IsBoolean()
  destinationLocation: boolean;

  @IsOptional()
  @IsString()
  destinationLocationCode?: string;

  @IsOptional()
  @IsString()
  continent?: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  travelType: string;

  @IsString()
  travelGenre: string;

  @IsString()
  activityPace: string;

  @IsString()
  keywords: string;
}
