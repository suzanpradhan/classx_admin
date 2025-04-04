import { selectorDataSchema } from '@/core/types/selectorType';
import { introTrackFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

export const durationSchema = z.object({
  hour: z.number().optional().nullable(),
  minutes: z.number().optional().nullable(),
  seconds: z.number(),
});

export type DurationSchemaType = z.infer<typeof durationSchema>;

export const trackSchema = z
  .object({
    id: z.number().optional().nullable(),
    slug: z.string(),
    artist: selectorDataSchema,
    title: z.string().pipe(nonempty),
    genres: z.array(selectorDataSchema).optional(),
    duration: durationSchema,
    intro_track: introTrackFile.optional().nullable(),
    intro_track_url: z.string().optional().nullable(),
    release: selectorDataSchema,
    wave_data: z.array(z.number()).optional().nullable(),
    wave_data_id: z.number().optional().nullable(),
    wave_data_from_source: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
    spotify: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      (data.intro_track !== null && data.intro_track !== undefined) ||
      (data.intro_track_url && data.intro_track_url.length > 1),
    {
      message: 'Audio track required',
      path: ['intro_track'], // Points to the 'intro_track' field in the error message
    }
  )
  .refine(
    (data) =>
      (data.wave_data_from_source && data.wave_data_from_source.length > 1) ||
      (data.wave_data && data.wave_data.length > 1),
    {
      message: '',
      path: ['intro_track'], // Points to the 'intro_track' field in the error message
    }
  );

export const genresSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string(),
});

export type TrackSchemaType = z.infer<typeof trackSchema>;

export const trackRequestSchema = trackSchema._def.schema._def.schema.extend({
  genres: z.array(genresSchema).optional(),
});
export type TrackRequestType = z.infer<typeof trackRequestSchema>;

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
  track_wave: number;
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
  slug: string;
};

export type TrackWaveType = {
  id: number;
  wave_data: string;
};
