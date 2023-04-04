import { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/prisma/db"
import { z } from "zod"

import { newId } from "@/lib/id"
import { publishEvent } from "@/lib/tinybird"

const headerValidation = z.object({
  "content-type": z.literal("application/json"),
  authorization: z.string(),
})

const bodyValidation = z.object({
  event: z.string(),
  icon: z.string().optional(),
  content: z.string().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  time: z.number().optional(),
  value: z.number().optional()
})

const queryValidation = z.object({
  channel: z.string().regex(/^[a-zA-Z0-9._-]{3,}$/),
})





export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405)
    }
    const headers = headerValidation.safeParse(req.headers)
    if (!headers.success) {
      res.status(400)
      return res.json({ error: `Bad request: ${headers.error.message}` })
    }



    const query = queryValidation.safeParse(req.query)
    if (!query.success) {
      return res.json({ error: `Bad request: ${query.error.message}` })
    }




    const apikey = await db.apiKey.findUnique({
      where: {
        keyHash: headers.data.authorization.replace("Bearer ", ""),
      },
      include: {
        team: {
          include: {
            channels: {
              where: {
                name: query.data.channel
              }
            }
          }
        }
      }
    })
    if (!apikey) {
      return res.status(403).json({ error: "Unauthorized" })
    }




    const body = bodyValidation.safeParse(req.body)
    if (!body.success) {
      return res
        .status(400)
        .json({ error: `Invalid body: ${body.error.message}` })
    }

    let channel = apikey.team.channels.find(c => c.name === query.data.channel)
    if (!channel) {
      channel = await db.channel.create({
        data: {
          id: newId("channel"),
          name: query.data.channel,
          team: {
            connect: {
              id: apikey.teamId
            }
          }
        }
      })
    }



    await publishEvent({
      id: newId("event"),
      teamId: apikey.teamId,
      channelId: channel!.id,
      time: new Date(body.data.time ?? Date.now()),
      event: body.data.event,
      content: body.data.content ?? "",
      metadata: JSON.stringify(body.data.metadata ?? {})
    })

    return res.status(200)
  } catch (e) {
    const error = e as Error
    console.error(error)
    res.status(500).json({ error })
    return
  } finally {
    res.end()
  }
}
