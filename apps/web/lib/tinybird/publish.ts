import { z } from "zod";

import { Tinybird } from "@chronark/zod-bird";

const tb = new Tinybird({ token: process.env.TINYBIRD_TOKEN! });

export const publishEvent = tb.buildIngestEndpoint({
  datasource: "events__v1",
  event: z.object({
    id: z.string(),
    tenantId: z.string(),
    channelId: z.string(),
    time: z.number().int(),
    event: z.string(),
    content: z.string().optional().default(""),
    // Stringified json
    metadata: z.string().optional().default(""),
  }),
});
