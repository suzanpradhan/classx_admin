import { z } from 'zod';

export const nonempty = z
  .string()
  .transform((t) => t?.trim())
  .pipe(z.string().min(1, { message: 'Required' }));

export const nonemptyDate = z
  .date()
  .refine((date) => !isNaN(date.getTime()), { message: 'Date is required' })
  .nullable();

export const introTrackFile = z.instanceof(File).refine(
  (file) => {
    const acceptedAudioTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
    ];
    return acceptedAudioTypes.includes(file.type);
  },
  {
    message: 'Invalid file type. Only audio files are allowed.',
  }
);

export const imageFile = z.instanceof(File).refine(
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

export const videoFile = z.instanceof(File).refine(
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

export const documentFile = z.instanceof(File).refine(
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
