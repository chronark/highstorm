"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

import { trpc } from "@/lib/trpc"
import { Feed } from "@/components/feed"
import { CumulativeEventsPerday } from "../[channelName]/charts"

export default function StreamsPage(props: { params: { teamSlug: string } }) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - 30)
    d.setUTCHours(0, 0, 0, 0)

    const activity = useSWR(
        { teamSlug: props.params.teamSlug, since: d.getTime() },
        trpc.event.dailyActivity.query,
        { refreshInterval: 15000 }
    )
    const { toast } = useToast()
    useEffect(() => {
        if (activity.error) {
            console.error(activity.error)
            toast({
                title: "Error",
                description: "There was an error fetching the events",
                variant: "destructive",
            })
        }
    }, [activity.error])

    return (
        <div className="h-full px-8 py-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        All your Events
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        The last 100 events from all of your channels in the current month
                    </p>
                </div>
            </div>
            <div className="border border-neutral-300 rounded-md bg-white p-2 mt-8">
                <span className="text-neutral-600 text-sm font-medium p-2">
                    Total Events
                </span>
                <div className="h-32 inset-x-0">
                    <CumulativeEventsPerday data={activity.data?.data ?? []} />
                </div>
            </div>
            <div className="mt-8">
                <Feed teamSlug={props.params.teamSlug} />
            </div>
        </div>
    )
}
