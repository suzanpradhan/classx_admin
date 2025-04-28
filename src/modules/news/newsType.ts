import { imageFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const newsSchema = z.object({
  id: z.number().optional().nullable(),
  title: z.string().pipe(nonempty),
  description: z.string().pipe(nonempty),
  date: z.date().optional().nullable(),
  time: z.string().optional().nullable(),
  content: z.string().pipe(nonempty),
  cover_image: imageFile.optional().nullable(),
});

export type NewsSchemaType = z.infer<typeof newsSchema>;

export type NewsType = {
  id: number;
  title: string;
  description: string;
  cover_image?: string;
  date: string;
  content: string;
};
