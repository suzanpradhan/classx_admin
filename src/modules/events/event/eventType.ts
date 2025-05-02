import {
  selectorDataSchema,
  selectorRequiredSchema,
} from '@/core/types/selectorType';
import { imageFile, nonempty, nonemptyDate } from '@/core/utils/formUtlis';
import { z } from 'zod';
import { EventCategoryType } from '../event_category/event_categoryType';
import { VenueDataType } from '../venue/venueType';

export type Organizer = {
  id: number;
  email: string;
  is_staff: boolean;
  profile: any;
  username: string;
  organizer_key: string | null;
};

export const eventSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().pipe(nonempty),
  description: z.string().pipe(nonempty),
  startDate: nonemptyDate,
  startTime: z.string().optional().nullable(),
  endDate: nonemptyDate,
  endTime: z.string().optional().nullable(),
  status: z.string(),
  duration: z.string(),
  organizer: selectorDataSchema,
  tags: z.array(selectorRequiredSchema),
  venue: selectorDataSchema,
  category: selectorDataSchema,
  image: imageFile.optional().nullable(),
});
export const tagsSchema = z.object({
  id: z.number().optional().nullable(),
  title: z.string(),
});

export const eventRequestSchema = eventSchema.extend({
  tags: z.array(tagsSchema).optional(),
});

export type EventSchemaType = z.infer<typeof eventSchema>;
export type EventRequestType = z.infer<typeof eventRequestSchema>;

export type EventType = {
  id: number;
  tags: Array<EventTagsType>;
  organizer: Organizer;
  category: EventCategoryType;
  venue: VenueDataType;
  is_favorite: boolean;
  name: string;
  image: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: string;
  views_count: number;
  favourites_count: number;
  is_refundable: boolean;
  is_featured: boolean;
};

export type EventTagsType = {
  id: number;
  title: string;
};
