import { z } from "zod";

export const TopicParamsSchema = z.object({
  topic: z.string().min(1),
});

export const PublishBodySchema = z.object({
  eventId: z.string().min(1),
  payload: z.unknown(),
});

export const SubscribeBodySchema = z.object({
  consumerId: z.string().min(1),
  fromStart: z.boolean().optional(),
});

export const PollQuerySchema = z.object({
  consumerId: z.string().min(1),
});

export const AckBodySchema = z.object({
  consumerId: z.string().min(1),
  eventId: z.string().min(1),
});

export type PublishBody = z.infer<typeof PublishBodySchema>;
export type SubscribeBody = z.infer<typeof SubscribeBodySchema>;
export type PollQuery = z.infer<typeof PollQuerySchema>;
export type AckBody = z.infer<typeof AckBodySchema>;
