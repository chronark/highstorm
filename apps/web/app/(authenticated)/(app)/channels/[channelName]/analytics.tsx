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
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ms from "ms";
import { Card } from "@/components/card";
import { Heading } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Feed } from "@/components/feed";
import { duration } from "@/lib/time";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Header } from "./header";
import { DeleteChannelButton } from "./deleteChannelButton";
import { Menu } from "lucide-react";

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

type Props = {
  channel: { id: string; name: string; description?: string };
};

export const Analytics: React.FC<Props> = ({ channel }) => {
  const now = new Date().setMinutes(0, 0, 0);

  const [since, setSince] = useState<keyof typeof sinceOptions>("7d");
  const [granularity, setGranularity] = useState<keyof typeof granularityOptions>("1d");

  const start = now - ms(since);
  const activity = trpc.event.channelActivity.useQuery({
    channelName: channel.name,
    start,
    granularity,
  });

  const events = trpc.event.list.useQuery({
    channelId: channel.id,
    start,
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
    ).map(({ time, value }) => ({ x: new Date(time).toLocaleString(), y: value })) ?? [];
  let sum = 0;
  const accumulatedUsage = usage.map(({ x, y }) => {
    sum += y;
    return { x, y: sum };
  });

  if (activity.isLoading) {
    return null;
  }

  return (
    <div>
      <Header
        channel={{ name: channel.name }}
        actions={[
          <Dialog key="menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="square">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Channel Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DeleteChannelButton channelId={channel.id} />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete this channel and remove
                  your data from our servers.
                </DialogDescription>
                <DialogFooter>
                  <DeleteChannelButton channelId={channel.id} />
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>,
        ]}
      />

      {activity.data?.data.length === 0 ? (
        <EmptyState
          title="Nothing happened yet"
          description="Send an event to this channel and then come back."
        />
      ) : (
        <div className="relative flex flex-col w-full py-4  lg:flex-row lg:py-8">
          <main className="w-full px-4 lg:w-2/3 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
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
            </div>
            <div className="mt-4 lg:mt-8">
              {activity.data?.data.length === 0 ? (
                <EmptyState
                  title="Nothing happened yet"
                  description="Send an event to this channel and then come back."
                />
              ) : (
                <div className="flex flex-col gap-4 lg:gap-8">
                  <Card>
                    <Heading h4>Events per Day</Heading>
                    <div className="h-32">
                      {activity.isLoading ? <Loading /> : <ColumnChart data={usage} />}
                    </div>
                  </Card>
                  <Card>
                    <Heading h4>Total Events</Heading>
                    <div className="h-32 ">
                      {activity.isLoading ? <Loading /> : <AreaChart data={accumulatedUsage} />}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </main>

          {/* The desktop sidebar is 18rem wide */}
          <aside className="bg-black/10 w-full lg:w-[calc((100vw-18rem)/3)] lg:fixed top-32 bottom-0 lg:right-0 lg:border-l lg:border-white/10">
            <header className="flex items-center justify-between px-4 py-4 border-b border-white/10 sm:px-6 sm:py-6 lg:px-8">
              <h2 className="text-base font-semibold text-white leading-7">Event Log</h2>
              <Link href="/overview" className="text-sm font-semibold leading-6 text-primary-400">
                View all
              </Link>
            </header>
            <ScrollArea className="h-full">
              <ul role="list" className="divide-y divide-white/10 ">
                {events.data?.data.map((event) => (
                  <Dialog key={event.id}>
                    <DialogTrigger className="w-full px-4 py-4 text-left sm:px-6 group lg:px-8 group-hover:bg-zinc-800 duration-1000">
                      <div className="flex items-center justify-between w-full  gap-x-3">
                        {/* <img src={event.user.imageUrl} alt="" className="flex-none w-6 h-6 rounded-full bg-zinc-800" /> */}
                        <h3 className="text-xs font-semibold text-white truncate  leading-6">
                          {event.event}
                        </h3>
                        <time
                          dateTime={new Date(event.time).toISOString()}
                          className="flex-none text-xs text-zinc-500 group-hover:text-zinc-400 duration-1000"
                        >
                          {duration(Date.now() - event.time)} ago
                        </time>
                      </div>
                      <p className="mt-3 text-sm truncate text-zinc-500 group-hover:text-zinc-300 duration-1000">
                        {event.content}
                      </p>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{event.event}</DialogTitle>

                        <DialogDescription>{event.content}</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-2 text-zinc-700">
                        {Object.entries(event.metadata ?? {}).map(([key, value]) => (
                          <>
                            <span className="font-mono text-sm text-zinc-400">{key}</span>
                            <span className="font-mono text-sm text-zinc-600">
                              {value as string}
                            </span>
                          </>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t gap-4 border-zinc-100">
                        <span className="text-xs text-zinc-400">
                          {new Date(event.time).toUTCString()}
                        </span>
                        <span className="font-mono text-xs text-zinc-400">{event.id}</span>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </ul>
            </ScrollArea>
          </aside>
        </div>
      )}
    </div>
  );
};
