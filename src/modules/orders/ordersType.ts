import { z } from "zod";


export const ordersSchema = z.object({
    id: z.number().optional().nullable(),
    status: z.string().optional(),
    billing_address: z.string(),
    billing_city: z.string(),
    billing_postal_code: z.string(),
    billing_country: z.string(),
    total_amount: z.string(),
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
    customer: Customer;
};
export type Profile = {
    id: number;
    full_name: string;
    phone: string | null;
    secondary_email: string | null;
    mobile: string | null;
    address: string | null;
    gender: string | null;
    birth_date: string | null;
    avatar: string | null;
    created_on: string;
    modified_on: string;
    is_staff: boolean;
};

export type Customer = {
    profile: Profile;
    is_staff: boolean;
};