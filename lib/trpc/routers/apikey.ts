import crypto from "node:crypto"
import { db } from "@/prisma/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { newId } from "@/lib/id"
import { t } from "../trpc"

export const apikeyRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const team = await db.team.findFirst({
        where: {
          id: input.teamId,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      const apiKey = newId("apiKey")

      await db.apiKey.create({
        data: {
          id: newId("apiKey"),
          keyHash: crypto.createHash("SHA-256").update(apiKey).digest("base64"),
          lastCharacters: apiKey.substring(apiKey.length - 4),
          name: "default",
          team: {
            connect: {
              id: team.id,
            },
          },
        },
      })
      return { apiKey }
    }),
  delete: t.procedure
    .input(
      z.object({
        keyId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      const key = await db.apiKey.findUnique({
        where: {
          id: input.keyId,
        },
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!key) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      if (!key.team.members.some((m) => m.userId === ctx.session!.user.id)) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      await db.apiKey.delete({
        where: {
          id: input.keyId,
        },
      })
    }),
})
