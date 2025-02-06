import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

const documentFile = z.instanceof(File).refine(
  (file) => {
    const acceptedDocumentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    return acceptedDocumentTypes.includes(file.type);
  },
  {
    message:
      'Invalid file type. Only document files (PDF, DOC, DOCX, XLS, XLSX, TXT) are allowed.',
  }
);

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

export type ArtitstBookingSchemaType = z.infer<typeof artitstBookingSchema>;

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
  artist?: ArtistType;
};
export type ArtistType = {
  id: number;
  name: string;
  bio: string;
  profile_picture: string;
};
