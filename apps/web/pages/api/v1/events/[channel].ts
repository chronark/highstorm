import { z } from "zod";

import { newId } from "@/lib/id-edge";
import { publishEvent } from "@/lib/tinybird";
import highstorm from "@highstorm/client";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { kysely } from "@/lib/kysely";
import { WebhookType } from "@prisma/client";

export const config = {
  runtime: "edge",
  regions: ["fra1"],
};

const bodyValidation = z.object({
  event: z.string(),
  icon: z.string().optional(),
  content: z.string().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
  time: z.number().optional(),
  value: z.number().optional(),
});

export default async function handler(
  req: NextRequest,
  ctx: NextFetchEvent,
): Promise<NextResponse> {
  try {
    if (req.method !== "POST") {
      return new NextResponse(null, { status: 405 });
    }

    let authorization = req.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    authorization = authorization.replace("Bearer ", "");
    const url = new URL(req.url);

    const channelName = url.searchParams.get("channel") ?? url.searchParams.get("nextParamchannel");
    if (!channelName) {
      return NextResponse.json({ error: "A channel name is required" }, { status: 400 });
    }
    if (!new RegExp(/^[a-zA-Z0-9._-]{3,}$/).test(channelName)) {
      return NextResponse.json(
        {
          error:
            "A channel name must only contain alphanumeric characters, dashes, underscores and periods",
        },
        { status: 400 },
      );
    }

    const body = bodyValidation.safeParse(
      await req.json().catch((err) => {
        throw new Error(`Invalid JSON body: ${err.message}`);
      }),
    );
    if (!body.success) {
      return NextResponse.json({ error: `Invalid body: ${body.error.message}` }, { status: 400 });
    }

    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(authorization));
    const hash = toBase64(buf);

    const apiKey = await kysely
      .selectFrom("ApiKey")
      .selectAll()
      .where("ApiKey.keyHash", "=", hash)
      .executeTakeFirst();

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const channel = await kysely
      .selectFrom("Channel")
      .selectAll()
      .where("Channel.name", "=", channelName)
      .where("Channel.tenantId", "=", apiKey.tenantId)

      .executeTakeFirst();

    const channelId = channel?.id ?? newId("channel");
    const eventId = newId("event");
    if (!channel) {
      await kysely
        .insertInto("Channel")
        .values({
          id: channelId,
          name: channelName,
          tenantId: apiKey.tenantId,
          updatedAt: new Date(),
        })
        .execute();

      await highstorm("channel.created", {
        event: "A new channel has been created",
        content: channelName,
        metadata: {
          tenantId: apiKey.tenantId,
          channelId: channelId,
          channelName: channelName,
        },
      });
    }

    const time = body.data.time ?? Date.now();
    await publishEvent({
      id: eventId,
      tenantId: apiKey.tenantId,
      channelId: channelId,
      time,
      event: body.data.event,
      content: body.data.content ?? "",
      metadata: JSON.stringify(body.data.metadata ?? {}),
    });

    const sendWebhooks = async () => {
      const webhooks = await kysely
        .selectFrom("Webhook")
        .select(["id", "type", "url", "method", "header"])
        .where("Webhook.channelId", "=", channelId)
        .execute();

      await Promise.all(
        webhooks.map(async (wh) => {
          const headers = new Headers({
            "Content-Type": "application/json",
            "User-Agent": "highstorm/1.0",
            "Highstorm-Channel-Id": channelId,
            "Highstorm-Event-Id": eventId,
          });
          for (const [k, v] of Object.entries(wh.header as Record<string, string>)) {
            headers.set(k, v);
          }
          let webhookBody = "";
          switch (wh.type) {
            case WebhookType.HTTP:
              webhookBody = JSON.stringify({
                event: body.data.event,
                content: body.data.content ?? "",
                metadata: body.data.metadata ?? {},
              });
              break;
            case WebhookType.SLACK:
              webhookBody = JSON.stringify({
                text: body.data.event,
                blocks: [
                  {
                    type: "header",
                    text: {
                      type: "plain_text",
                      text: body.data.event,
                    },
                  },
                  {
                    type: "section",
                    text: {
                      type: "plain_text",
                      text: body.data.content,
                    },
                  },
                  {
                    type: "section",
                    fields: [
                      {
                        type: "mrkdwn",
                        text: `*Time:*\n${new Date(time).toISOString()}`,
                      },
                      {
                        type: "mrkdwn",
                        text: `*Metadata:*\n${JSON.stringify(body.data.metadata ?? {})}`,
                      },
                    ],
                  },
                  {
                    type: "section",
                    fields: [
                      {
                        type: "mrkdwn",
                        text: `<https://highstorm.app/channels/${channelName}|Details>`,
                      },
                    ],
                  },
                ],
              });
              break;

            default:
              console.error(`Unknown webhook type: ${wh.type}`);
              return;
          }

          const res = await fetch(wh.url, {
            method: wh.method,
            headers,
            body: webhookBody,
          });
          if (!res.ok) {
            throw new Error(`Unable to send webhook to ${wh.url}: ${await res.text()}`);
          }
        }),
      );
    };

    ctx.waitUntil(
      sendWebhooks().catch((err) => {
        console.error(err);
      }),
    );

    return NextResponse.json({ id: eventId });
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function toBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
