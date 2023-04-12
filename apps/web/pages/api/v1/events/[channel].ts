import { z } from "zod";

import { InMemoryCache } from "@/lib/cache";
import { newId } from "@/lib/id-edge";
import { publishEvent } from "@/lib/tinybird";
import { highstorm } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { kysely } from "@/lib/kysely";

export const config = {
  runtime: "edge",
};

const headerValidation = z.object({
  "content-type": z.literal("application/json"),
  authorization: z.string(),
});

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

const channelValidation = z.string().regex(/^[a-zA-Z0-9._-]{3,}$/);

/**
 * Cache api keys
 */
const cache = new InMemoryCache<{
  tenantId: string;
  channelId: string;
}>({ ttl: 60_000 });

export default async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== "POST") {
      return new NextResponse(null, { status: 405 });
    }

    const headers = headerValidation.safeParse({
      "content-type": req.headers.get("content-type"),
      authorization: req.headers.get("authorization"),
    });
    if (!headers.success) {
      return NextResponse.json({ error: `Bad request: ${headers.error.message}` }, { status: 400 });
    }
    const url = new URL(req.url);

    const channelName = channelValidation.safeParse(url.searchParams.get("channel"));
    if (!channelName.success) {
      return NextResponse.json(
        { error: `Bad request: ${channelName.error.message}` },
        { status: 400 },
      );
    }
    const key = headers.data.authorization.replace("Bearer ", "");
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
    const hash = toBase64(buf);

    let cached = cache.get(hash);
    if (!cached) {
      const [apiKey, channel] = await Promise.all([
        kysely
          .selectFrom("ApiKey")
          .selectAll()
          .where("ApiKey.keyHash", "=", hash)
          .executeTakeFirst(),
        kysely
          .selectFrom("Channel")
          .selectAll()
          .where("Channel.name", "=", channelName.data)
          .executeTakeFirst(),
      ]);
      if (!apiKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const channelId = channel?.id ?? newId("channel");

      if (!channel) {
        await kysely
          .insertInto("Channel")
          .values({
            id: channelId,
            name: channelName.data,
            tenantId: apiKey.tenantId,
            updatedAt: new Date(),
          })
          .executeTakeFirstOrThrow();
        await highstorm("channel.created", {
          event: "A new channel has been created",
          content: channelName.data,
          metadata: {
            tenantId: apiKey.tenantId,
            channelId: channelId,
            channelName: channelName.data,
          },
        });
      }
      cached = { tenantId: apiKey.tenantId, channelId };
      cache.set(key, cached);
    }

    const body = bodyValidation.safeParse(
      await req.json().catch((err) => {
        throw new Error(`Invalid JSON body: ${err.message}`);
      }),
    );
    if (!body.success) {
      return NextResponse.json({ error: `Invalid body: ${body.error.message}` }, { status: 400 });
    }

    const id = newId("event");
    await publishEvent({
      id,
      tenantId: cached.tenantId,
      channelId: cached.channelId,
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
