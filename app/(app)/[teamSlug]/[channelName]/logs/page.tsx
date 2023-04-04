import { redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { EmptyEventsFallback } from "@/components/empty-events-fallback"
import { Feed } from "@/components/feed"

export default async function IndexPage(props: {
  params: { teamSlug: string; channelName: string }
}) {
  const { session } = await getSession()

  if (!session) {
    return redirect("/auth/sign-in")
  }

  const channel = await db.channel.findFirst({
    where: {
      AND: {
        team: {
          slug: props.params.teamSlug,
        },
        name: props.params.channelName,
      },
    },
    include: {
      team: {
        include: {
          apikeys: true,
        },
      },
    },
  })
  if (!channel) {
    return redirect(`/${props.params.teamSlug}`)
  }

  return (
    <div>
      <div className="mt-8">
        <Feed
          teamSlug={props.params.teamSlug}
          channelId={channel.id}
          fallback={
            // @ts-expect-error RSC
            <EmptyEventsFallback
              teamSlug={props.params.teamSlug}
              channelName={channel.name}
            />
          }
        />
      </div>
    </div>
  )
}
