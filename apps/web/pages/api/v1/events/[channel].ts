import { z } from "zod";

import { newId } from "@/lib/id-edge";
import { publishEvent } from "@/lib/tinybird";
import { highstorm } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { kysely } from "@/lib/kysely";

export const config = {
  runtime: "edge",
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

export default async function handler(req: NextRequest): Promise<NextResponse> {
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

    if (!channel) {
      await kysely
        .insertInto("Channel")
        .values({
          id: channelId,
          name: channelName,
          tenantId: apiKey.tenantId,
          updatedAt: new Date(),
        })
        .executeTakeFirstOrThrow();
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

    const id = newId("event");
    await publishEvent({
      id,
      tenantId: apiKey.tenantId,
      channelId: channelId,
      time: body.data.time ?? Date.now(),
      event: body.data.event,
      content: body.data.content ?? "",
      metadata: JSON.stringify(body.data.metadata ?? {}),
    });

    return NextResponse.json({ id });
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
