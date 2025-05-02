import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const userProfileSchema = z.object({
  full_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
});

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string().pipe(nonempty),
  profile: userProfileSchema,
});

export type UserSchemaType = z.infer<typeof userSchema>;

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  profile: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};
