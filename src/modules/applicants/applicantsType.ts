import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';
import { GenresType } from '../genres/genresType';

const imageFile = z.instanceof(File).refine(
  (file) => {
    const acceptedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];
    return acceptedImageTypes.includes(file.type);
  },
  {
    message: 'Invalid file type. Only image files are allowed.',
  }
);

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

export const applicantsSchema = z.object({
  id: z.number().optional().nullable(),
  full_name: z.string().pipe(nonempty),
  age: z.number(),
  perm_address: z.string().pipe(nonempty),
  current_address: z.string().pipe(nonempty),
  why_classx: z.string(),
  email: z.string().email({ message: 'Invalid email format' }),
  carrer_plan: z.string(),
  applicant_type: z.string(),
  photo: imageFile.optional().nullable(),
  genre: selectorDataSchema,
  document: documentFile.optional().nullable(),
  prev_work_link: z.string().url({ message: 'Invalid URL format.' }),
});

export type ApplicantsSchemaType = z.infer<typeof applicantsSchema>;

export type ApplicantsType = {
  id: number;
  full_name: string;
  age: number;
  perm_address?: string;
  current_address?: string;
  email?: string;
  photo?: string;
  applicant_type?: string;
  document?: string;
  prev_work_link?: string;
  why_classx?: string;
  carrer_plan?: string;
  genre?: GenresType;
};
