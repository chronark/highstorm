import { newId } from "@/lib/id";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";
import { db } from "@/prisma/db";

export const channelRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await db.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        include: {
          teams: true,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

    }),
});