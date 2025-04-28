import { selectorDataSchema } from '@/core/types/selectorType';
import { imageFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const venueSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().pipe(nonempty),
  city: selectorDataSchema,
  description: z.string().pipe(nonempty),
  image: imageFile.optional().nullable(),
});

export type VenueSchemaType = z.infer<typeof venueSchema>;
export type VenueDataType = {
  id: number;
  city: CityType;
  name: string;
  image: string;
  description: string;
};
export type CityType = {
  id: number;
  name: string;
  state: number;
};
