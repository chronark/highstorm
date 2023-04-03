import { z } from "zod"

import { Tinybird } from "./client"

const tb = new Tinybird()

export const getChannelActivity = tb.buildPipe({
  pipe: "get_channel_activity__v1",
  parameters: z.object({
    teamId: z.string(),
    channelId: z.string().optional(),
    since: z.number(),
    granularity: z.enum(["1d", "1h"]),
  }),
  data: z.object({
    time: z.string().transform((s) => new Date(s).getTime()),
    count: z
      .number()
      .nullable()
      .optional()
      .transform((v) => (typeof v === "number" ? v : 0))
  }),
})
