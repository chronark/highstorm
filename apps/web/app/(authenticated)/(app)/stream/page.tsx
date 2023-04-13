"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";

import { trpc } from "@/lib/trpc";
import { Feed } from "@/components/feed";
import { CumulativeEventsPerDay } from "../channels/[channelName]/charts";

export default function StreamsPage(props: { params: { tenantSlug: string } }) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 30);
  d.setUTCHours(0, 0, 0, 0);

  const activity = useSWR(
    {
      tenantSlug: props.params.tenantSlug,
      start: d.getTime(),
      granularity: "1h",
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
    <div className="h-full px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">All your Events</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {/* The last 1000 events from all of your channels in the current month */}
          </p>
        </div>
      </div>
      <div className="mt-8 overflow-hidden bg-white border rounded-md dark:bg-transparent border-neutral-300 dark:border-neutral-700">
        <span className="p-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Events per Day
        </span>
        <div className="h-32">
          <CumulativeEventsPerDay data={activity.data?.data ?? []} />
        </div>
      </div>
      <div className="mt-8">
        <Feed tenantSlug={props.params.tenantSlug} />
      </div>
    </div>
  );
}
