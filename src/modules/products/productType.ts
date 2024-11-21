import { selectorDataSchema } from "@/core/types/selectorType";
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


export const artistSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
})
export const productsSchema = z.object({
    id: z.number().optional().nullable(),
    artist: selectorDataSchema,
    deleted: z.string().optional().nullable(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    thumbnail: imageFile.optional().nullable(),
    price: z.string(),
    stock: z.string(),
    product_type: z.string(),
    release: z.string(),
});
export type ProductsSchemaType = z.infer<typeof productsSchema>;


export type ProductsType = {
    id?: number | null;
    artist: {
        id?: number | null;
        name: string;

    };
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    price: string;
    stock: string;
    product_type: string;
    created_by: number;
    modified_by: number;
    release: number;
};
