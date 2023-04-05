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
    <div className="flex flex-col mt-8 gap-8">
      <div className="p-2 bg-white border border-neutral-300 rounded-md">
        <span className="p-2 text-sm font-medium text-neutral-600">
          Events per Day
        </span>
        <div className="h-32">
          <EventsPerDay data={activity.data?.data ?? []} />
        </div>
      </div>
      <div className="p-2 bg-white border border-neutral-300 rounded-md">
        <span className="p-2 text-sm font-medium text-neutral-600">
          Total Events
        </span>
        <div className="inset-x-0 h-32">
          <CumulativeEventsPerday data={activity.data?.data ?? []} />
        </div>
      </div>
    </div>
  )
}
