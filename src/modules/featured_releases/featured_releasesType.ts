import { selectorRequiredSchema } from '@/core/types/selectorType';
import { z } from 'zod';
import { ReleasesType } from '../releases/releasesType';
const videoFile = z.instanceof(File).refine(
  (file) => {
    const acceptedVideoTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/x-matroska',
      'video/webm',
      'video/ogg',
      'video/mpeg',
      'video/3gpp',
      'video/3gpp2',
      'video/x-m4v',
      'video/x-f4v',
      'video/vnd.dlna.mpeg-tts',
      'video/x-ms-asf',
      'video/x-ms-vob',
      'video/x-mpegurl',
      'application/vnd.apple.mpegurl',
      'video/mp2t',
    ];
    return acceptedVideoTypes.includes(file.type);
  },
  {
    message:
      'Invalid file type. Only MP4, MOV, AVI, WMV, FLV, MKV, and WEBM formats are allowed.',
  }
);

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
