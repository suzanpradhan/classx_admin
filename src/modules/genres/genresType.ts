import { z } from 'zod';

export const genresSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
});

export type GenresSchemaType = z.infer<typeof genresSchema>;

export type GenresType = {
    id: number;
    name: string;
};
