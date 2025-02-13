import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { introTrackFile } from '@/core/utils/helper';
import { z } from 'zod';

export const trackSchema = z.object({
  id: z.number().optional().nullable(),
  slug: z.string(),
  artist: selectorDataSchema,
  title: z.string().pipe(nonempty),
  genres: z.array(selectorDataSchema).optional(),
  duration: z.string(),
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
