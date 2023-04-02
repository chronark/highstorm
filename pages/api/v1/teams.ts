import { db } from "@/prisma/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import crypto from "node:crypto"
import { getAuth } from "@clerk/nextjs/server";



const contentTypeValidation = z.object({
    "content-type": z.literal("application/json"),
})


const bodyValidation = z.object({
    slug: z.string(),
    name: z.string(),

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
        const { userId } = getAuth(req)
        if (!userId) {

            return res.status(403).json({ error: "Expected auth" })
        }

        const body = bodyValidation.safeParse(req.body)
        if (!body.success) {
            return res.status(40).json({ error: `Request is malformed: ${body.error.message}` })
        }

        const team = await db.team.create({
            data: {
                id: crypto.randomUUID(),
                name: body.data.name,
                slug: body.data.slug,
                members: {
                    create: {
                        userId,
                        role: "OWNER",
                    }
                },
                plan: "FREE"
            }
        })





        return res.status(200).json(team)

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