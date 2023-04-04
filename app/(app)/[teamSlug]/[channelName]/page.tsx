"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

import { trpc } from "@/lib/trpc"
import { CumulativeEventsPerday, EventsPerDay } from "./charts"

export default function AnalyticsPage(props: {
  params: { teamSlug: string; channelName: string }
}) {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)

  const activity = useSWR(
    {
      teamSlug: props.params.teamSlug,
      channelName: props.params.channelName,
      since: d.getTime(),
    },
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
    <div className="flex flex-col gap-8 mt-8">
      <div className="border border-neutral-300 rounded-md bg-white p-2">
        <span className="text-neutral-600 text-sm font-medium p-2">
          Events per Day
        </span>
        <div className="h-32">
          <EventsPerDay data={activity.data?.data ?? []} />
        </div>
      </div>
      <div className="border border-neutral-300 rounded-md bg-white p-2">
        <span className="text-neutral-600 text-sm font-medium p-2">
          Total Events
        </span>
        <div className="h-32 inset-x-0">
          <CumulativeEventsPerday data={activity.data?.data ?? []} />
        </div>
      </div>
    </div>
  )
}
