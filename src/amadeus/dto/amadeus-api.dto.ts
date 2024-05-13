// lists of DTOs for Amadeus API

import { z } from 'zod';

// DTO for location keyword is a string and subType is a string containing either 'city' or 'airport'
export const LocationDTO = z.object({
  keyword: z.string(),
  subType: z
    .string()
    .refine(
      (value) => value === 'CITY' || value === 'AIRPORT',
      'Invalid subType',
    ),
});
