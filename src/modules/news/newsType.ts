import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';

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

export const newsSchema = z.object({
    id: z.number().optional().nullable(),
    title: z.string().pipe(nonempty),
    description: z.string().pipe(nonempty),
    date: z.date().optional().nullable(),
    time: z.string().optional().nullable(),
    content: z.string().pipe(nonempty),
    cover_image: imageFile.optional().nullable(),
});

export type NewsSchemaType = z.infer<typeof newsSchema>;

export type NewsType = {
    id: number;
    title: string;
    description: string,
    cover_image?: string;
    date: string;
    content: string;
};
