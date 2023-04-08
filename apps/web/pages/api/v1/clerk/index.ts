import { db } from "@/prisma/db";
import { NextApiRequest, NextApiResponse } from "next";

import { z } from "zod";

const body = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user.created"),
    data: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    type: z.literal("user.updated"),
    data: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    type: z.literal("organization.created"),
    data: z.object({
      id: z.string(),
      slug: z.string(),
    }),
  }),
]);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = body.safeParse(req.body);
    if (!r.success) {
      console.error(r.error.message);
      return res.status(400).send(r.error.message);
    }

    switch (r.data.type) {
      case "user.created":
        await db.tenant.create({
          data: {
            id: r.data.data.id,
            plan: "FREE",
          },
        });

        break;
      case "user.updated":
        await db.tenant.upsert({
          where: {
            id: r.data.data.id,
          },
          update: {},
          create: {
            id: r.data.data.id,
            plan: "FREE",
          },
        });

        break;
      case "organization.created":
        await db.tenant.create({
          data: {
            id: r.data.data.id,
            slug: r.data.data.slug,
            plan: "PRO",
          },
        });
        break;
      default:
        break;
    }

    return res.status(200);
  } catch (err) {
    console.error(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
