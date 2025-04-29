import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

const imageFile = z.instanceof(File).refine(
  (file) => {
    const acceptedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];
    return acceptedImageTypes.includes(file.type);
  },
  {
    message: 'Invalid file type. Only image files are allowed.',
  }
);

export const accountProfileSchema = z.object({
  full_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  secondary_email: z.string().email().optional(),
  mobile: z.string().optional(),
  address: z.string(),
  gender: z.string(),
  dob: z.string(),
  avatar: imageFile.optional().nullable(),
  is_staff: z.boolean(),
});

export const accountSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string().pipe(nonempty),
  is_staff: z.boolean(),
  profile: accountProfileSchema,
  organizer_key: z.string().pipe(nonempty),
});

export type UserSchemaType = z.infer<typeof accountSchema>;

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  profile: {
    first_name: string;
    middle_name: string;
    last_name: string;
    avatar: string;
    dob: string;
    secondary_email?: string;
    mobile?: string;
    address: string;
    gender: string;
  };
  organizer_key: string;
};
