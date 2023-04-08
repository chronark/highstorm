import { z } from "zod";

import { Tinybird } from "./client";

const tb = new Tinybird();

const eventValidation = z.object({
  id: z.string(),
  tenantId: z.string(),
  channelId: z.string(),
  time: z.number(),
  event: z.string(),
  content: z.string().optional().default(""),
  // Stringified json
  metadata: z.string().optional().default(""),
});

export async function publishEvent(event: z.infer<typeof eventValidation>): Promise<void> {
  await tb.publish("events__v1", eventValidation.parse(event));
}
