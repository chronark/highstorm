import crypto from "node:crypto";
import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Policy } from "@/lib/policies";

import { newId } from "@/lib/id";
import { auth, t } from "../trpc";

export const apikeyRouter = t.router({
  create: t.procedure
    .use(auth)
    .input(
      z.object({
        name: z.string(),
        permissions: z.object({
          channels: z.union([
            z.literal("*"),
            z.record(
              z.object({
                create: z.boolean(),
                read: z.boolean(),
                update: z.boolean(),
                ingest: z.boolean(),
                delete: z.boolean(),
              }),
            ),
          ]),
        }),
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

      const channelRules =
        input.permissions.channels === "*"
          ? {
              [`${tenant.id}::channel::*`]: ["create", "read", "update", "delete", "ingest"],
            }
          : Object.entries(input.permissions.channels).reduce((acc, channel) => {
              const permissions = Object.entries(channel[1])
                .filter(([_action, allowed]) => allowed)
                .map(([action, _allowed]) => action);
              if (permissions.length > 0) {
                acc[`${tenant.id}::channel::${channel[0]}`] = permissions;
              }
              return acc;
            }, {} as any);

      const policy = new Policy({
        resources: {
          channel: channelRules,
        },
      });

      const apiKey = newId("apiKey");

      await db.apiKey.create({
        data: {
          id: newId("api"),
          keyHash: crypto.createHash("SHA-256").update(apiKey).digest("base64"),
          firstCharacters: apiKey.substring(0, 7), // hs_ + 4 characters
          name: input.name,
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
          policy: policy.toString(),
        },
      });
      return { apiKey, root: input.permissions.channels === "*" };
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
