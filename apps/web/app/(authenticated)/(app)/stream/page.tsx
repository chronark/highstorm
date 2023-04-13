"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import { trpc } from "@/lib/trpc/client";
import { Feed } from "@/components/feed";
import { AreaChart, fillRange } from "@/components/charts";

export default function StreamsPage() {
  const now = new Date().setMinutes(0, 0, 0);
  const start = now - 1000 * 60 * 60 * 24 * 7;
  const granularity = "1h";

  const activity = trpc.event.channelActivity.useQuery({
    start,
    granularity,
  });
  console.log(activity);
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

  const usage =
    fillRange(
      (activity.data?.data ?? []).map(({ time, count }) => ({ time, value: count })),
      start,
      now,
      granularity,
    ).map(({ time, value }) => ({ x: new Date(time).toUTCString(), y: value })) ?? [];
  let sum = 0;
  const accumulatedUsage = usage.map(({ x, y }) => {
    sum += y;
    return { x, y: sum };
  });

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
          Events per Hour
        </span>
        <div className="h-32">
          <AreaChart data={accumulatedUsage} />
        </div>
      </div>
      <div className="mt-8">
        <Feed />
      </div>
    </div>
  );
}
