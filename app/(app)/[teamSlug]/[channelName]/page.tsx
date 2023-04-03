import { notFound, redirect } from "next/navigation"
import { Event, db } from "@/prisma/db"

import { getSession } from "@/lib/auth"

import { getChannelActivity } from "@/lib/tinybird";
import { Chart, CumulativeEventsPerday, EventsPerday } from "./charts";

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
            events: true,
            team: true,
        },
    })
    if (!channel) {
        return redirect(`/${props.params.teamSlug}`)
    }


    const activity = await getChannelActivity({
        teamId: channel.team.id,
        channelId: channel.id,
        since: Date.now() - 1000 * 60 * 60 * 24,
        granularity: "1h",
    })

    return (
        <div>

            <div className="mt-4 border border-neutral-300 rounded-md bg-neutral-50 p-2">
                <span className="text-neutral-600 text-sm font-medium">Events per Day</span>
                <div className="h-32">

                    <EventsPerday data={activity.data} />
                </div>
            </div>
            <div className="mt-4 border border-neutral-300 rounded-md bg-neutral-50 p-2">
                <span className="text-neutral-600 text-sm font-medium">Total Events</span>
                <div className="h-32">

                    <CumulativeEventsPerday data={activity.data} />
                </div>
            </div>

        </div>
    )
}
