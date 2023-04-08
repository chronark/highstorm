import { z } from "zod";

import { Tinybird } from "./client";

const tb = new Tinybird();

export const getChannelActivity = tb.buildPipe({
  pipe: "get_channel_activity__v2",
  parameters: z.object({
    tenantId: z.string(),
    channelId: z.string().optional(),
    start: z.number(),
    end: z.number().optional(),
    granularity: z.enum(["1m", "1h", "1d", "1w", "1m"]),
  }),
  data: z.object({
    time: z.string().transform((s) => new Date(s).getTime()),
    count: z
      .number()
      .nullable()
      .optional()
      .transform((v) => (typeof v === "number" ? v : 0)),
  }),
});

export const getEventCount = tb.buildPipe({
  pipe: "get_event_count__v1",
  parameters: z.object({
    channelId: z.string().optional(),
    start: z.number(),
    end: z.number(),
  }),
  data: z.object({
    count: z
      .number()
      .nullable()
      .optional()
      .transform((v) => (typeof v === "number" ? v : 0)),
  }),
});

export const getEvents = tb.buildPipe({
  pipe: "get_events__v1",
  parameters: z.object({
    tenantId: z.string(),
    channelId: z.string().optional(),
    since: z.number(),
  }),
  data: z.object({
    id: z.string(),
    channelId: z.string(),
    event: z.string(),
    time: z.string().transform((d) => new Date(d).getTime()),
    content: z.string(),
    metadata: z.string().transform((m) => JSON.parse(m)),
  }),
});
