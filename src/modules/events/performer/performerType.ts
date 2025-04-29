import { selectorDataSchema } from '@/core/types/selectorType';
import { z } from 'zod';
import { EventType } from '../event/eventType';

export const eventPerformerSchema = z.object({
  id: z.number().optional().nullable(),
  performer: selectorDataSchema,
  event: selectorDataSchema,
});

export type EventPerformerSchemaType = z.infer<typeof eventPerformerSchema>;

export type EventPerfomerDataTypes = {
  id: number;
  performer: PerfomerDataTypes;
  event: EventType;
};

export type PerfomerDataTypes = {
  uuid: string;
  name: string;
  slug: string;
  label: LabelType;
  bio: string;
  profile_picture: string;
};

export type LabelType = {
  id: number;
  email: string;
  username: number;
  profile: number;
};
