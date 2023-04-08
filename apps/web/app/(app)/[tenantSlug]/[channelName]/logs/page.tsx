import { redirect } from "next/navigation";
import { db } from "@/prisma/db";

import { auth } from "@clerk/nextjs/app-beta";
import { EmptyEventsFallback } from "@/components/empty-events-fallback";
import { Feed } from "@/components/feed";

export default async function IndexPage(props: {
  params: { tenantSlug: string; channelName: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/auth/sign-in");
  }

  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          slug: props.params.tenantSlug,
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
