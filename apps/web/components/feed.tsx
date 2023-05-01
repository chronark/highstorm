import React from "react";

import { duration } from "@/lib/time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  events: {
    id: string;
    event: string;
    content: string | null;
    time: number;
    metadata?: Record<string, string | number | boolean | null>;
  }[];
};
export const Feed: React.FC<Props> = ({ className, events }) => {
  const feed: Record<string, typeof events> = {};
  events
    .sort((a, b) => b.time - a.time)
    .forEach((e) => {
      const key = new Date(e.time).toDateString();
      if (!feed[key]) {
        feed[key] = [];
      }
      feed[key].push(e);
    });

  return (
    <ScrollArea className={cn("h-full overflow-y-auto relative", className)}>
      {Object.keys(feed).map((day) => (
        <div key={day} className="relative">
          <div className="sticky top-0 z-10 px-4 py-1 text-sm font-medium dark:shadow bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 text-zinc-800">
            <h3>{day}</h3>
          </div>
          <ul role="list" className="relative divide-y divide-zinc-200 dark:divide-zinc-800">
            {feed[day].map((event) => (
              <li key={event.id}>
                <Dialog>
                  <DialogTrigger className="relative w-full px-4 py-3 group  hover:bg-white dark:hover:bg-zinc-800">
                    <div className="flex justify-between px-2 space-x-3">
                      <div className="text-left ">
                        <div className="block focus:outline-none">
                          <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-200">
                            {event.event}
                          </p>
                          <p className="text-sm truncate text-zinc-500 group-hover:text-zinc-200 ">
                            {event.content}
                          </p>
                        </div>
                      </div>
                      <time
                        dateTime={new Date(event.time).toISOString()}
                        className="text-sm  text-zinc-500 whitespace-nowrap group-hover:text-zinc-200"
                      >
                        {duration(Date.now() - event.time, true)} ago
                      </time>
                    </div>
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
                          <span className="font-mono text-sm text-zinc-600">{value}</span>
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
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ScrollArea>
  );
};
