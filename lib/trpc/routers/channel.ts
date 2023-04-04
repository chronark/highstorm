import { db } from "@/prisma/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { newId } from "@/lib/id"
import { t } from "../trpc"

export const channelRouter = t.router({
  delete: t.procedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const user = await db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          teams: {
            include: {
              team: {
                include: {
                  channels: {
                    where: {
                      id: input.channelId,
                    },
                  },
                },
              },
            },
          },
        },
      })
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      if (
        !user.teams.some((t) =>
          t.team.channels.some((c) => c.id === input.channelId)
        )
      ) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      await db.channel.delete({
        where: {
          id: input.channelId,
        },
      })
    }),
})
