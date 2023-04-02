import { db } from "@/prisma/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import crypto from "node:crypto"



const contentTypeValidation = z.object({
    "content-type": z.literal("application/json"),
})

const authorizationValidation = z.object({
    "authorization": z.string()
})

const channelValidation = z.string().regex(/^[a-zA-Z0-9._-]{3,}$/)

const bodyValidation = z.object({
    event: z.string(),
    icon: z.string().optional(),
    content: z.string().optional(),
    time: z.number().optional()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

        const teamId = auth.data.authorization.replace("Bearer ", "")


        const channel = channelValidation.safeParse(req.query.channel)
        if (!channel.success) {
            return res.status(400).json({ error: "Invalid channel name" })
        }

        const body = bodyValidation.safeParse(req.body)
        if (!body.success) {
            return res.status(400).json({ error: `Invalid body: ${body.error.message}` })
        }

        await db.event.create({
            data: {
                id: crypto.randomUUID(),
                event: body.data.event,
                content: body.data.content,
                icon: body.data.icon,
                time: body.data.time ? new Date(body.data.time) : new Date(),
                team: {
                    connect: {
                        id: teamId
                    }
                },
                channel: {
                    connectOrCreate: {
                        where: {
                            teamId_name: {
                                teamId,
                                name: channel.data
                            }
                        },
                        create: {
                            id: crypto.randomUUID(),
                            name: channel.data,
                            teamId,

                        }
                    }
                }


            }
        })




        return res.status(200)

    } catch (e) {
        const error = e as Error
        console.error(error)
        res.status(500).json({ error })
        return
    }
    finally {
        res.end()
    }
}