import { db } from "@/prisma/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { getChannelActivity, getEvents } from "@/lib/tinybird"
import { t } from "../trpc"

export const eventRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        teamSlug: z.string(),
        channelId: z.string().optional(),
        since: z.number().default(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const team = await db.team.findFirst({
        where: {
          slug: input.teamSlug,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          channels: true,
        },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      if (
        input.channelId &&
        !team.channels.some((c) => c.id === input.channelId)
      ) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      return getEvents({
        teamId: team.id,
        channelId: input.channelId,
        since: input.since,
      })
    }),
  dailyActivity: t.procedure
    .input(
      z.object({
        teamSlug: z.string(),
        channelName: z.string().optional(),
        since: z.number().default(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const team = await db.team.findFirst({
        where: {
          slug: input.teamSlug,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          channels: true,
        },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      const channel = input.channelName
        ? team.channels.find((c) => c.name === input.channelName)
        : undefined
      if (input.channelName && !channel) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      return getChannelActivity({
        teamId: team.id,
        channelId: channel?.id,
        since: input.since,
        granularity: "1d",
      })
    }),
})
