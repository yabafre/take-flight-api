// src/users/dto/create-user.dto.ts

import { z } from 'zod';

const ProvidersMetaDto = z.object({
  provider: z.string(),
  providers: z.array(z.string()),
});

export const CreateUserDto = z.object({
  id: z.string().optional(),
  aud: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  email: z.string().email(),
  encrypted_password: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  providers: ProvidersMetaDto.optional(),
});
