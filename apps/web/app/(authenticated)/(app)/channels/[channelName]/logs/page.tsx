import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { EmptyEventsFallback } from "@/components/empty-events-fallback";
import { Feed } from "@/components/feed";
import { getTenantId } from "@/lib/auth";

export default async function IndexPage(props: {
  params: { channelName: string };
}) {
  const tenantId = getTenantId();
  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          id: tenantId,
        },
        name: props.params.channelName,
      },
    },
  });
  if (!channel) {
    return notFound();
  }

  return (
    <div>
      <div className="mt-8">
        <Feed
          channelId={channel.id}
          fallback={
            // @ts-expect-error RSC
            <EmptyEventsFallback channelName={channel.name} />
          }
        />
      </div>
    </div>
  );
}
