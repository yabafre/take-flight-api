import { z } from 'zod';
import { CreateUserDto } from '@/users/dto/create-user.dto';

export type CreateUserType = z.infer<typeof CreateUserDto>;
