import { db } from "@/prisma/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { buffer } from "micro";
import { env } from "@/lib/env";

import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
    const msg = wh.verify((await buffer(req)).toString(), req.headers as any);

    const r = body.safeParse(msg);
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
