import { selectorRequiredSchema } from '@/core/types/selectorType';
import { videoFile } from '@/core/utils/helper';
import { z } from 'zod';
import { ReleasesType } from '../releases/releasesType';

export const featuredReleasesSchema = z.object({
  id: z.number().optional().nullable(),
  release: selectorRequiredSchema,
  link: z.string().optional(),
  video: videoFile.optional().nullable(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

export type FeaturedReleasesSchemaType = z.infer<typeof featuredReleasesSchema>;

export type FeaturedReleasesType = {
  id: number;
  release: ReleasesType;
  video?: string;
  title?: string;
  subtitle?: string;
  link?: string;
};
