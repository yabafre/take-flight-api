import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export const flightOffersDTO = z
  .object({
    originLocationCode: z.string(),
    destinationLocationCode: z.string(),
    departureDate: z.string(),
    returnDate: z.string().optional(),
    adults: z.number().min(1),
    children: z.number().optional(),
    maxPrice: z.number().optional(),
    max: z.number().optional(),
  })
  .strict();

export class SearchFlightDto extends createZodDto(flightOffersDTO) {
  @IsString()
  originLocationCode: string;

  @IsString()
  destinationLocationCode: string;

  @IsString()
  departureDate: string;

  @IsOptional()
  @IsString()
  returnDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  children?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  maxPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  max?: number;
}
