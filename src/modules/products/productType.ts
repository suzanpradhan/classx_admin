import { z } from "zod";

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
export const productsSchema = z.object({
    id: z.number().optional().nullable(),
    artist: z.object({
        id: z.number().optional().nullable(),
        name: z.string(),
        bio: z.string(),
        profile_picture: z.string(),
    }),
    deleted: z.string().optional().nullable(),
    deleted_by_cascade: z.boolean(),
    created_on: z.string().optional().nullable(),
    modified_on: z.string().optional().nullable(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    thumbnail: imageFile.optional().nullable(),
    price: z.string(),
    stock: z.number(),
    product_type: z.string(),
    created_by: z.number(),
    modified_by: z.number(),
    release: z.number(),
});


export type ProductsType = {
    id?: number | null;
    artist: {
        id?: number | null;
        name: string;
        bio: string;
        profile_picture: string;
    };
    deleted?: string | null;
    deleted_by_cascade: boolean;
    created_on?: string | null;
    modified_on?: string | null;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    price: string;
    stock: number;
    product_type: string;
    created_by: number;
    modified_by: number;
    release: number;
};
