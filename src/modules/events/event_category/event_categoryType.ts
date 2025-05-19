import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const eventCategorySchema = z.object({
  id: z.number().nullable().optional(),
  title: z.string().pipe(nonempty),
});
export type EventCategorySchemaType = z.infer<typeof eventCategorySchema>;

export type EventCategoryType = {
  id?: number;
  title: string;
};
