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
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  time: z.number().optional(),
  value: z.number().optional()
})

const queryValidation = z.object({
  create: z.string().optional().transform(s => s === "auto"),
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


    if (query.data.create) {
      await db.channel.upsert({
        where: {
          teamId_name: {
            teamId: apikey.teamId,
            name: query.data.channel
          }
        },
        update: {},
        create: {
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

    const event = await db.event.create({
      data: {
        id: newId("event"),
        event: body.data.event,
        content: body.data.content,
        metadata: body.data.metadata,
        icon: body.data.icon,
        time: body.data.time ? new Date(body.data.time) : new Date(),
        team: {
          connect: {
            id: apikey.teamId,
          },
        },
        channel: {
          connect: {
            teamId_name: {
              teamId: apikey.teamId,
              name: query.data.channel,
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
