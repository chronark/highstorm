"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";

import { trpc } from "@/lib/trpc";
import { Feed } from "@/components/feed";
// import { CumulativeEventsPerday } from "../[channelName]/charts";

export default function StreamsPage(props: { params: { tenantSlug: string } }) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 30);
  d.setUTCHours(0, 0, 0, 0);

  const activity = useSWR(
    { tenantSlug: props.params.tenantSlug, start: d.getTime() },
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
            The last 100 events from all of your channels in the current month
          </p>
        </div>
      </div>
      <div className="p-2 mt-8 bg-white border rounded-md border-neutral-300">
        <span className="p-2 text-sm font-medium text-neutral-600">Total Events</span>
        <div className="inset-x-0 h-32">
          {/* <CumulativeEventsPerday data={activity.data?.data ?? []} /> */}
        </div>
      </div>
      <div className="mt-8">
        <Feed tenantSlug={props.params.tenantSlug} />
      </div>
    </div>
  );
}
