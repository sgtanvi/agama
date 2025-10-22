import { z } from "zod";

export const broadcastSchema = z.object({
  eventId: z.string().uuid(),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1600, "Message must be 1600 characters or less"),
  channel: z.literal("sms").default("sms"),
});

export type BroadcastInput = z.infer<typeof broadcastSchema>;
