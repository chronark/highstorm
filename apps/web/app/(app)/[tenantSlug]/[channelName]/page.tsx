"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";

import { trpc } from "@/lib/trpc";
import { CumulativeEventsPerday, EventsPerDay } from "./charts";
import { Loading } from "@/components/loading";

export default function AnalyticsPage(props: {
  params: { tenantSlug: string; channelName: string };
}) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 30);
  d.setUTCHours(0, 0, 0, 0);
  console.log(d.getTime());
  const activity = useSWR(
    {
      channelName: props.params.channelName,
      start: d.getTime(),
    },
    trpc.event.channelActivity.query,
    { refreshInterval: 15000 },
  );
  const { toast } = useToast();
  useEffect(() => {
    if (activity.error) {
      console.error(activity.error);
      toast({
        title: "Error",
        description: "There was an error fetching the events",
        variant: "destructive",
      });
    }
  }, [activity.error]);

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="p-2 bg-white border rounded-md border-neutral-300">
        <span className="p-2 text-sm font-medium text-neutral-600">Events per Day</span>
        <div className="h-32">
          {activity.isLoading ? <Loading /> : <EventsPerDay data={activity.data?.data ?? []} />}
        </div>
      </div>
      <div className="p-2 bg-white border rounded-md border-neutral-300">
        <span className="p-2 text-sm font-medium text-neutral-600">Total Events</span>
        <div className="inset-x-0 h-32">
          {activity.isLoading ? (
            <Loading />
          ) : (
            <CumulativeEventsPerday data={activity.data?.data ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
