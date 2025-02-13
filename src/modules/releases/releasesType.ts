import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { imageFile } from '@/core/utils/helper';
import { z } from 'zod';

export const releasesSchema = z.object({
  id: z.number().optional().nullable(),
  artist: selectorDataSchema,
  title: z.string().pipe(nonempty),
  genres: z.array(selectorDataSchema).optional(),
  description: z.string().optional().nullable(),
  release_type: z.string(),
  release_date: z.date().optional(),
  cover: imageFile.optional().nullable(),
  cover_url: z.string().optional().nullable(),
  cover_small: imageFile.optional().nullable(),
  price: z.string(),
  slug: z.string(),
});

export const genresSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string(),
});
export const releasesRequestSchema = releasesSchema.extend({
  genres: z.array(genresSchema).optional(),
});

export type ReleasesSchemaType = z.infer<typeof releasesSchema>;
export type ReleasesRequestType = z.infer<typeof releasesRequestSchema>;

export type ReleasesType = {
  id: number;
  artist: ArtistType;
  title: string;
  genres: GenreType[];
  product_slug: string;
  description: string;
  release_type: string;
  release_date: string;
  cover_small?: string;
  cover?: string;
  price: string;
};

export type GenreType = {
  id: number;
  name: string;
};
export type ArtistType = {
  id: number;
  name: string;
  bio: string;
  profile_picture: string;
};
