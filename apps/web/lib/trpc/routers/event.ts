import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getChannelActivity, getEvents } from "@/lib/tinybird";
import { auth, t } from "../trpc";

export const eventRouter = t.router({
  list: t.procedure
    .use(auth)
    .input(
      z.object({
        channelId: z.string().optional(),
        since: z.number().default(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tenant = await db.tenant.findUnique({
        where: {
          id: ctx.tenant.id,
        },
        include: {
          channels: {
            where: {
              id: input.channelId,
            },
          },
        },
      });

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const channel = tenant.channels.at(0);
      if (!channel) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return getEvents({
        tenantId: tenant.id,
        channelId: channel.id,
        since: input.since,
      });
    }),
  channelActivity: t.procedure
    .use(auth)
    .input(
      z.object({
        tenantSlug: z.string(),
        channelName: z.string().optional(),
        start: z.number().default(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: z.number().optional(),
        granularity: z.enum(["1m", "1h", "1d", "1w", "1m"]).default("1h"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const tenant = await db.tenant.findUnique({
        where: {
          id: ctx.tenant.id,
        },
        include: {
          channels: true,
        },
      });

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const channel = input.channelName
        ? tenant.channels.find((c) => c.name === input.channelName)
        : undefined;
      if (input.channelName && !channel) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return getChannelActivity({
        tenantId: tenant.id,
        channelId: channel?.id,
        start: input.start,
        end: input.end,
        granularity: input.granularity,
      });
    }),
});
