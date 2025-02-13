import { z } from 'zod';
import { nonempty } from '../utils/formUtlis';

export const selectorDataSchema = z.object({
  value: z.string(),
  label: z.string(),
  extra: z.string().optional(),
  __isNew__: z.boolean().optional(),
});

export const selectorBaseSchema = z.object({
  label: z.string(),
  extra: z.string().optional(),
  __isNew__: z.boolean().optional(),
});

export type SelectorDataType = z.infer<typeof selectorDataSchema>;
export const selectorRequiredSchema = selectorBaseSchema.extend({
  value: z.string().pipe(nonempty),
});
