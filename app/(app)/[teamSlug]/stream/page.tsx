import { notFound, redirect } from "next/navigation"
import { Event, db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { getChannelActivity } from "@/lib/tinybird"
import { Chart } from "./chart"

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
    const allEvents = await db.event.findMany({
        where: {
            team: {
                slug: props.params.teamSlug,
            }
        },
        orderBy: {
            time: "desc",
        },
        take: 100,
    })
    const events: Record<
        string,
        Event[]
    > = {}
    allEvents
        .sort((a, b) => a.time.getTime() - b.time.getTime())
        .forEach((e) => {
            const key = e.time.toDateString()
            if (!events[key]) {
                events[key] = []
            }
            events[key].push(e)
        })
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
            <div className="h-32 mt-4 border border-neutral-300 rounded-md bg-neutral-50 py-2">

                <Chart data={activity.data} />
            </div>
            <div className="relative mt-4">
                <div className="overflow-y-auto h-full">
                    {Object.keys(events).map((day) => (
                        <div key={day} className="relative">
                            <div className="sticky top-0 z-10 border border-neutral-300 rounded-md bg-neutral-50 px-6 py-1 text-sm font-medium text-neutral-500">
                                <h3>{day}</h3>
                            </div>
                            <ul
                                role="list"
                                className="relative z-0 divide-y divide-neutral-200"
                            >
                                {events[day].map((event) => (
                                    <li
                                        key={event.id}
                                        className="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <a href="#" className="block focus:outline-none">
                                                    <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                    />
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        {event.event}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {event.description}
                                                    </p>
                                                </a>
                                            </div>
                                            <time
                                                dateTime={event.time.toISOString()}
                                                className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                            >
                                                {event.time.toLocaleTimeString()}
                                            </time>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
