"use client";

import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/prisma/db";
import { Ghost } from "lucide-react";

import { duration } from "@/lib/time";
import { trpc } from "@/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "./loading";

type Props = {
  channelId?: string;
  fallback?: React.ReactNode;
};
export const Feed: React.FC<Props> = ({ channelId, fallback }) => {
  const { data, error, isLoading } = trpc.event.list.useQuery({ channelId });
  const { toast } = useToast();
  useEffect(() => {
    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error fetching the events",
        variant: "destructive",
      });
    }
  }, [error]);

  const feed: Record<
    string,
    {
      id: string;
      event: string;
      content: string | null;
      time: number;
      metadata?: Record<string, string | number | boolean | null>;
    }[]
  > = {};
  data?.data
    .sort((a, b) => b.time - a.time)
    .forEach((e) => {
      const key = new Date(e.time).toDateString();
      if (!feed[key]) {
        feed[key] = [];
      }
      feed[key].push(e);
    });

  return (
    <div className="overflow-hidden border rounded-md border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
      {isLoading ? (
        <div className="h-[60vh] animate-pulse flex items-center justify-center">
          <Loading />
        </div>
      ) : data && data.data.length === 0 ? (
        fallback
      ) : (
        <ScrollArea className="h-[60vh]">
          {Object.keys(feed).map((day) => (
            <div key={day} className="relative">
              <div className="sticky top-0 z-10 px-4 py-1 text-sm font-medium dark:shadow bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 text-neutral-800">
                <h3>{day}</h3>
              </div>
              <ul
                role="list"
                className="relative divide-y divide-neutral-200 dark:divide-neutral-800"
              >
                {feed[day].map((event) => (
                  <li key={event.id}>
                    <Dialog>
                      <DialogTrigger className="relative w-full px-4 py-3 group bg-neutral-50 hover:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-700">
                        <div className="flex justify-between space-x-3">
                          <div className="flex-1 min-w-0 text-left">
                            <div className="block focus:outline-none">
                              <p className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-200">
                                {event.event}
                              </p>
                              <p className="text-sm truncate text-neutral-500 group-hover:text-neutral-200 ">
                                {event.content}
                              </p>
                            </div>
                          </div>
                          <time
                            dateTime={new Date(event.time).toISOString()}
                            className="flex-shrink-0 text-sm text-neutral-500 whitespace-nowrap group-hover:text-neutral-200"
                          >
                            {duration(Date.now() - event.time)} ago
                          </time>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{event.event}</DialogTitle>

                          <DialogDescription>{event.content}</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2 text-neutral-700">
                          {Object.entries(event.metadata ?? {}).map(([key, value]) => (
                            <>
                              <span className="font-mono text-sm text-neutral-400">{key}</span>
                              <span className="font-mono text-sm text-neutral-600">{value}</span>
                            </>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-neutral-100">
                          <span className="text-xs text-neutral-400">
                            {new Date(event.time).toUTCString()}
                          </span>
                          <span className="font-mono text-xs text-neutral-400">{event.id}</span>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};
