import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { introTrackFile } from '@/core/utils/helper';
import { z } from 'zod';

export const durationSchema = z.object({
  hour: z.number().optional().nullable(),
  minutes: z.number().optional().nullable(),
  seconds: z.number(),
});

export type DurationSchemaType = z.infer<typeof durationSchema>;

export const trackSchema = z.object({
  id: z.number().optional().nullable(),
  slug: z.string(),
  artist: selectorDataSchema,
  title: z.string().pipe(nonempty),
  genres: z.array(selectorDataSchema).optional(),
  duration: durationSchema,
  youtube: z.string().url({ message: 'Invalid URL format.' }),
  spotify: z.string().url({ message: 'Invalid URL format.' }),
  intro_track: introTrackFile.optional().nullable(),
  release: selectorDataSchema,
});

export const genresSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string(),
});
export const trackRequestSchema = trackSchema.extend({
  genres: z.array(genresSchema).optional(),
});

export type TrackRequestType = z.infer<typeof trackRequestSchema>;
export type TrackSchemaType = z.infer<typeof trackSchema>;

export type Trackstype = {
  id: number;
  genres: GenreType[];
  title: string;
  slug: string;
  duration: string;
  youtube: string;
  spotify: string;
  intro_track: string;
  artist: ArtistType;
  release: ReleaseType;
};

export type GenreType = {
  id: number;
  name: string;
};

export type ReleaseType = {
  id: number;
  title: string;
};
export type ArtistType = {
  id: number;
  name: string;
  bio: string;
  profile_picture: string;
};
