import { redirect } from "next/navigation";
import { db } from "@/prisma/db";

import { EmptyEventsFallback } from "@/components/empty-events-fallback";
import { Feed } from "@/components/feed";
import { getTenantId } from "@/lib/auth";

export default async function IndexPage(props: {
  params: { tenantSlug: string; channelName: string };
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
    include: {
      tenant: {
        include: {
          apikeys: true,
        },
      },
    },
  });
  if (!channel) {
    return redirect(`/${props.params.tenantSlug}`);
  }

  return (
    <div>
      <div className="mt-8">
        <Feed
          tenantSlug={props.params.tenantSlug}
          channelId={channel.id}
          fallback={
            // @ts-expect-error RSC
            <EmptyEventsFallback tenantSlug={props.params.tenantSlug} channelName={channel.name} />
          }
        />
      </div>
    </div>
  );
}
