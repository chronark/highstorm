import { z } from "zod"

import { Tinybird } from "./client"

const tb = new Tinybird()

const eventValidation = z.object({
  id: z.string(),
  teamId: z.string(),
  channelId: z.string(),
  time: z.date(),
})

export async function publishEvent(
  event: z.infer<typeof eventValidation>
): Promise<void> {
  await tb.publish("events__v1", eventValidation.parse(event))
}
