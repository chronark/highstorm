import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { t, auth } from "../trpc";

export const channelRouter = t.router({
  delete: t.procedure
    .use(auth)
    .input(
      z.object({
        channelId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const channel = await db.channel.findFirst({
        where: {
          AND: {
            id: input.channelId,
            tenantId: ctx.tenant.id,
          },
        },
      });
      if (!channel) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.channel.delete({
        where: {
          id: channel.id,
        },
      });
    }),
});
