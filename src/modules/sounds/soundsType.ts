import { selectorDataSchema } from '@/core/types/selectorType';
import { introTrackFile, nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';
import { ArtistsType } from '../artists/artistsType';
import { genresSchema, GenresType } from '../genres/genresType';
import { durationSchema } from '../tracks/trackType';

export const soundSchema = z.object({
  id: z.number().optional().nullable(),
  artist: selectorDataSchema,
  title: z.string().pipe(nonempty),
  genres: z.array(selectorDataSchema).optional(),
  track: introTrackFile.optional().nullable(),
  duration: durationSchema,
});
export const soundRequestSchema = soundSchema.extend({
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
