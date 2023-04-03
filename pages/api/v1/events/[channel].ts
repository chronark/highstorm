import { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/prisma/db"
import { z } from "zod"

import { newId } from "@/lib/id"
import { publishEvent } from "@/lib/tinybird"

const contentTypeValidation = z.object({
  "content-type": z.literal("application/json"),
})

const authorizationValidation = z.object({
  authorization: z.string(),
})

const channelValidation = z.string().regex(/^[a-zA-Z0-9._-]{3,}$/)

const bodyValidation = z.object({
  event: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  time: z.number().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405)
    }
    if (!contentTypeValidation.safeParse(req.headers).success) {
      res.status(400)
      return res.json({ error: "Expected json" })
    }
    const auth = authorizationValidation.safeParse(req.headers)
    if (!auth.success) {
      res.status(400)
      return res.json({ error: "Expected auth" })
    }

    const hash = authorizationValidation.safeParse(req.headers)
    if (!hash.success) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const apikey = await db.apiKey.findUnique({
      where: {
        keyHash: hash.data.authorization.replace("Bearer ", ""),
      },
      include: {
        team: true,
      },
    })
    if (!apikey) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const channel = channelValidation.safeParse(req.query.channel)
    if (!channel.success) {
      return res.status(400).json({ error: "Invalid channel name" })
    }

    const body = bodyValidation.safeParse(req.body)
    if (!body.success) {
      return res
        .status(400)
        .json({ error: `Invalid body: ${body.error.message}` })
    }

    const event = await db.event.create({
      data: {
        id: newId("event"),
        event: body.data.event,
        description: body.data.description,
        metadata: body.data.metadata,
        icon: body.data.icon,
        time: body.data.time ? new Date(body.data.time) : new Date(),
        team: {
          connect: {
            id: apikey.teamId,
          },
        },
        channel: {
          connectOrCreate: {
            where: {
              teamId_name: {
                teamId: apikey.teamId,
                name: channel.data,
              },
            },
            create: {
              id: newId("channel"),
              name: channel.data,
              teamId: apikey.teamId,
            },
          },
        },
      },
    })

    await publishEvent({
      id: event.id,
      teamId: event.teamId,
      channelId: event.channelId,
      time: event.time,
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
