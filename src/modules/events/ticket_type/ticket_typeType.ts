import { selectorDataSchema } from '@/core/types/selectorType';
import { nonempty } from '@/core/utils/formUtlis';
import { z } from 'zod';
import { EventType } from '../event/eventType';

export const ticketTypeSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().pipe(nonempty),
  price: z.string(),
  event: selectorDataSchema,
  stock: z.object({ quantity: z.number().gt(0) }),
  max_quantity_per_order: z.number(),
});

export type TicketTypeSchemaType = z.infer<typeof ticketTypeSchema>;

export type TicketTypeDataType = {
  id: number;
  name: string;
  price: string;
  max_quantity_per_order: number;
  event: EventType;
  stock: { id: number; quantity: number };
};
