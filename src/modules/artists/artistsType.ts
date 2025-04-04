import { selectorDataSchema } from '@/core/types/selectorType';
import { documentFile, imageFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const artistsSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().pipe(nonempty),
  slug: z.string().optional(),
  bio: z.string(),
  profile_picture: imageFile.optional().nullable(),
});
export const artitstBookingSchema = z.object({
  id: z.number().optional().nullable(),
  full_name: z.string().pipe(nonempty),
  phone: z.string().optional(),
  event_date: z.date().optional().nullable(),
  event_time: z.string().optional().nullable(),
  event_type: z.string().optional(),
  email: z.string().email(),
  location: z.string().optional(),
  document: documentFile.optional().nullable(),
  info: z.string().optional(),
  artist: selectorDataSchema,
});
export const artistInfosSchema = z.object({
  id: z.number().optional().nullable(),
  artist: selectorDataSchema,
  text_two: z.string().optional(),
  text_one: z.string(),
  feat_text: z.string(),
  about: z.string(),
  book_artist: z.string(),
});

export type ArtitstBookingSchemaType = z.infer<typeof artitstBookingSchema>;
export type ArtistsSchemaType = z.infer<typeof artistsSchema>;
export type ArtistInfosSchemaType = z.infer<typeof artistInfosSchema>;

export type ArtitstBookingType = {
  id: number;
  full_name: string;
  event_date?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  location?: string;
  document?: string;
  info?: string;
  artist?: ArtistsType;
};

export type ArtistsType = {
  id: number;
  slug: string;
  name: string;
  bio: string;
  profile_picture?: string;
};

export type ArtistInfosType = {
  id: number;
  artist: ArtistsType;
  about: string;
  feat_text: string;
  text_one?: string;
  text_two?: string;
  book_artist?: string;
};
