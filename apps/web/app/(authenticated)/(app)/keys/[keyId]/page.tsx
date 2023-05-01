import { notFound, redirect } from "next/navigation";
import { db } from "@/prisma/db";

import { getTenantId } from "@/lib/auth";
import { Client } from "./client";

export default async function Page(props: { params: { keyId: string } }) {
  const tenantId = getTenantId();
  const apiKey = await db.apiKey.findUnique({
    where: {
      id: props.params.keyId,
    },
    include: {
      tenant: {
        include: {
          channels: true,
        },
      },
    },
  });
  if (!apiKey) {
    return redirect("/keys");
  }
  if (apiKey.tenantId !== tenantId) {
    return redirect("/keys");
  }

  return (
    <Client
      apiKey={apiKey}
      channelIdToName={apiKey.tenant.channels.reduce(
        (acc, channel) => ({ ...acc, [channel.id]: channel.name }),
        {},
      )}
    />
  );
}
