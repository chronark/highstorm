import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { newId } from "@/lib/id";
import { auth, t } from "../trpc";

export const webhookRouter = t.router({
  create: t.procedure
    .use(auth)
    .input(
      z.object({
        channelId: z.string(),
        url: z.string(),
        method: z.string(),
        headers: z.record(z.string()).optional(),
        type: z.enum(["HTTP", "SLACK"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log({ input });
      const channel = await db.channel.findUnique({
        where: {
          id: input.channelId,
        },
      });
      if (!channel) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (channel.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const webhookId = newId("webhook");

      await db.webhook.create({
        data: {
          id: webhookId,
          channel: {
            connect: {
              id: input.channelId,
            },
          },
          header: input.headers,
          method: input.method,
          name: "default",
          type: input.type,
          url: input.url,
        },
      });
    }),
  delete: t.procedure
    .use(auth)
    .input(
      z.object({
        webhookId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const webhook = await db.webhook.findUnique({
        where: {
          id: input.webhookId,
        },
        include: {
          channel: true,
        },
      });

      if (!webhook || webhook.channel.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await db.webhook.delete({ where: { id: input.webhookId } });
    }),
});
