import crypto from "node:crypto";
import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { newId } from "@/lib/id";
import { auth, t } from "../trpc";

export const apikeyRouter = t.router({
  create: t.procedure
    .use(auth)
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const tenant = await db.tenant.findFirst({
        where: {
          id: ctx.tenant.id,
        },
      });

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const apiKey = newId("apiKey");

      await db.apiKey.create({
        data: {
          id: newId("apiKey"),
          keyHash: crypto.createHash("SHA-256").update(apiKey).digest("base64"),
          lastCharacters: apiKey.substring(apiKey.length - 4),
          name: input.name,
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
        },
      });
      return { apiKey };
    }),
  delete: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await db.apiKey.findUnique({
        where: {
          id: input.keyId,
        },
        include: {
          tenant: true,
        },
      });

      if (!key || key.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.apiKey.delete({
        where: {
          id: key.id,
        },
      });
    }),
});
