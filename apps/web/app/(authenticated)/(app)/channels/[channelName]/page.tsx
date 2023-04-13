"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { trpc } from "@/lib/trpc/client";
import { AreaChart, ColumnChart, fillRange } from "@/components/charts";
import { Loading } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ms from "ms";

const sinceOptions = {
  "1h": "Last hour",
  "6h": "Last 6 hours",
  "1d": "Last 24 hours",
  "3d": "Last 3 days",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};
const granularityOptions = {
  "1h": "1 hour",
  "1d": "1 day",
};

export default function AnalyticsPage(props: {
  params: { channelName: string };
}) {
  const now = new Date().setMinutes(0, 0, 0);

  const [since, setSince] = useState<keyof typeof sinceOptions>("7d");
  const [granularity, setGranularity] = useState<keyof typeof granularityOptions>("1d");

  const start = now - ms(since);
  const activity = trpc.event.channelActivity.useQuery({
    channelName: props.params.channelName,
    start,
    granularity,
  });
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
    <>
      <div className="flex items-center justify-end w-full gap-4">
        <Select onValueChange={(v: keyof typeof sinceOptions) => setSince(v)}>
          <SelectTrigger>
            <SelectValue defaultValue={"7d"} placeholder={sinceOptions["7d"]} />
          </SelectTrigger>
          <SelectContent>
            <DropdownMenuLabel>Time Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(sinceOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(v: keyof typeof granularityOptions) => setGranularity(v)}>
          <SelectTrigger>
            <SelectValue defaultValue={"1d"} placeholder={granularityOptions["1d"]} />
          </SelectTrigger>
          <SelectContent>
            <DropdownMenuLabel>Granularity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(granularityOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <Select onValueChange={(v: keyof typeof metricOptions) => setMetric(v)}>
            <SelectTrigger>
              <SelectValue defaultValue="p75" placeholder={metricOptions["p75"]} />
            </SelectTrigger>
            <SelectContent>
              <DropdownMenuLabel>Metric</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(metricOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
      </div>
      <div className="mt-8">
        {activity.data?.data.length === 0 ? (
          <EmptyState
            title="Nothing happened yet"
            description="Send an event to this channel and then come back."
          />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="overflow-hidden bg-white border rounded-md dark:bg-transparent border-neutral-300 dark:border-neutral-700">
              <span className="p-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Events per Day
              </span>
              <div className="h-32">
                {activity.isLoading ? <Loading /> : <ColumnChart data={usage} />}
              </div>
            </div>
            <div className="overflow-hidden bg-white border rounded-md dark:bg-transparent border-neutral-300 dark:border-neutral-700">
              <span className="p-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total Events
              </span>
              <div className="h-32 ">
                {activity.isLoading ? <Loading /> : <AreaChart data={accumulatedUsage} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
