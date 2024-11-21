import { selectorDataSchema } from "@/core/types/selectorType";
import { z } from "zod";

const introTrackFile = z
    .instanceof(File)
    .refine(
        (file) => {
            const acceptedAudioTypes = [
                'audio/mpeg', // MP3
                'audio/wav',  // WAV
                'audio/ogg',  // OGG
                'audio/flac', // FLAC
                'audio/aac',  // AAC
            ];
            return acceptedAudioTypes.includes(file.type);
        },
        {
            message: 'Invalid file type. Only audio files are allowed.',
        }
    );

export const trackSchema = z.object({
    id: z.number().optional().nullable(),
    slug: z.string(),
    artist: z.string(),
    title: z.string(),
    genres: z.array(selectorDataSchema).optional(),
    duration: z.string(),
    intro_track: introTrackFile.optional().nullable(),
    release: z.string(),
});

export const genresSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
});
export const trackRequestSchema = trackSchema.extend({
    genres: z.array(genresSchema).optional(),
});

export type TrackRequestType = z.infer<typeof trackRequestSchema>;
export type TrackSchemaType = z.infer<typeof trackSchema>;

export type Trackstype = {
    id: number;
    genres: GenreType[];
    title: string;
    slug: string;
    duration: string;
    intro_track: string;
    artist: number;
    release: number;
}

export type GenreType = {
    id: number,
    name: string,
}