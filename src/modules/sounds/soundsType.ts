import { selectorDataSchema } from '@/core/types/selectorType';
import { introTrackFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';
import { ArtistsType } from '../artists/artistsType';
import { genresSchema, GenresType } from '../genres/genresType';
import { durationSchema } from '../tracks/trackType';

export const soundSchema = z
  .object({
    id: z.number().optional().nullable(),
    artist: selectorDataSchema,
    title: z.string().pipe(nonempty),
    genres: z.array(selectorDataSchema).optional(),
    track: introTrackFile.optional().nullable(),
    track_url: z.string().optional().nullable(),
    wave_data: z.array(z.number()).optional().nullable(),
    wave_data_id: z.number().optional().nullable(),
    wave_data_from_source: z.string().optional().nullable(),
    duration: durationSchema,
  })
  .refine(
    (data) =>
      (data.track !== null && data.track !== undefined) ||
      (data.track_url && data.track_url.length > 1),
    {
      message: 'Audio track required',
      path: ['track'], // Points to the 'track' field in the error message
    }
  )
  .refine(
    (data) =>
      (data.wave_data_from_source && data.wave_data_from_source.length > 1) ||
      (data.wave_data && data.wave_data.length > 1),
    {
      message: 'Wave data or wave data source required',
      path: ['track'], // Points to the 'track' field in the error message
    }
  );

export const soundRequestSchema = soundSchema._def.schema._def.schema.extend({
  genres: z.array(genresSchema).optional(),
});

export type SoundRequestType = z.infer<typeof soundRequestSchema>;
export type SoundSchemaType = z.infer<typeof soundSchema>;

export type SoundsType = {
  id: number;
  genres: GenresType[];
  title: string;
  track_wave: number;
  duration: string;
  track: string;
  artist: ArtistsType;
};
