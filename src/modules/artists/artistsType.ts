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

export const artistsSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
    bio: z.string(),
    profile_picture: imageFile.optional().nullable(),
});

export type ArtistsSchemaType = z.infer<typeof artistsSchema>;

export type ArtistsType = {
    id: number;
    name: string;
    bio: string,
    profile_picture?: string;
};
