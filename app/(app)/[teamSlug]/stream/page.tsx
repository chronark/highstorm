import { notFound, redirect } from "next/navigation"
import {  db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { getChannelActivity } from "@/lib/tinybird"
import { CumulativeEventsPerday } from "../[channelName]/charts"
import { Feed } from "@/components/feed"

export default async function IndexPage(props: {
    params: { teamSlug: string }
}) {
    const { session } = await getSession()

    if (!session) {
        return redirect("/auth/sign-in")
    }

    const team = await db.team.findUnique({ where: { slug: props.params.teamSlug } })
    if (!team) {
        return notFound()
    }

    const activity = await getChannelActivity({
        teamId: team.id,
        since: Date.now() - 1000 * 60 * 60 * 24,
        granularity: "1h",
    })

    return (
        <div className="h-full px-8 py-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        All Events
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        The last 100 events from all of your channels
                    </p>
                </div>
            </div>
            <div className="border border-neutral-300 rounded-md bg-white p-2">
                <span className="text-neutral-600 text-sm font-medium p-2">Total Events</span>
                <div className="h-32 inset-x-0">
                    <CumulativeEventsPerday data={activity.data} />
                </div></div>
            <div className="mt-8">
                <Feed  teamSlug={team.slug}/>
            </div>
        </div>
    )
}
