import { selectorDataSchema } from '@/core/types/selectorType';
import { z } from 'zod';

const zipFile = z
    .instanceof(File)
    .refine(
        (file) => {
            const acceptedZipTypes = [
                'application/zip',
                'application/x-zip-compressed',
                'application/x-compressed',
                'application/x-7z-compressed',
                'application/octet-stream',
                'multipart/x-zip',
                'application/x-tar',
            ];
            // console.log("file type", file.type)
            return file.type && acceptedZipTypes.includes(file.type);
        },
        { message: 'Invalid file type. Only ZIP files are allowed.' }
    )
    .refine(
        (file) => file.size > 0,
        { message: 'File cannot be empty.' }
    );


export const digital_downloadSchema = z.object({
    id: z.number().optional().nullable(),
    release: selectorDataSchema,
    file: zipFile.optional().nullable(),
    max_downloads: z.string(),

});

export type Digital_DownloadSchemaType = z.infer<typeof digital_downloadSchema>;

export type Digital_DownloadType = {
    id: number;
    release: Release;
    file: string;
    max_downloads: string;
};

export type Genre = {
    id: number;
    name: string;
};

export type Artist = {
    id: number;
    name: string;
    bio: string;
    profile_picture: string;
};

export type Release = {
    id: number;
    artist: Artist;
    genres: Genre[];
    product_slug: string;
    title: string;
    description: string;
    release_type: string;
    release_date: string;
    cover: string;
    cover_small: string;
};
