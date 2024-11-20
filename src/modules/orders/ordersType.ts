import { z } from "zod";


export const ordersSchema = z.object({
    id: z.number().optional().nullable(),
    status: z.string().optional(),
    billing_address: z.string(),
    billing_city: z.string(),
    billing_postal_code: z.string(),
    billing_country: z.string(),
    total_amount: z.string(),
    // created_by: z.number(),
    // modified_by: z.number(),
    // customer: z.number(),
});

export type OrdersSchemaType = z.infer<typeof ordersSchema>;


export type OrdersType = {
    id: number;
    status: string;
    billing_address: string;
    billing_city: string;
    billing_postal_code: string;
    billing_country: string;
    total_amount: string;
    // created_by: number;
    // modified_by: number;
    // customer: number;
};
