import crypto from "node:crypto";
import { db } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { newId } from "@/lib/id";
import { auth, t } from "../trpc";
import { Client as QStash } from "@upstash/qstash";
import { env } from "@/lib/env";
const qstash = new QStash({
  token: env.QSTASH_TOKEN,
});

export const reportRouter = t.router({
  createSlack: t.procedure
    .use(auth)
    .input(
      z.object({
        cron: z.string(),
        channelId: z.string(),
        timeframe: z.number(),
        slackUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
      const reportId = newId("report");

      const { scheduleId } = await qstash.publish({
        url: `https://highstorm.app/api/v1/reports/${reportId}`,
        cron: input.cron,
      });
      await db.report.create({
        data: {
          id: reportId,
          channel: {
            connect: {
              id: input.channelId,
            },
          },
          cron: input.cron,
          scheduleId,
          timeframe: input.timeframe,
          slackDestinations: {
            create: {
              id: newId("destination"),
              url: input.slackUrl,
            },
          },
        },
      });
      // Trigger it once, just to demo
      await qstash.publish({
        url: `https://highstorm.app/api/v1/reports/${reportId}`,
      });
    }),
  delete: t.procedure
    .use(auth)
    .input(
      z.object({
        reportId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const report = await db.report.findUnique({
        where: {
          id: input.reportId,
        },
        include: {
          channel: true,
        },
      });

      if (!report || report.channel.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await qstash.schedules.delete({ id: report.scheduleId });

      await db.report.delete({
        where: {
          id: input.reportId,
        },
      });
    }),
});
