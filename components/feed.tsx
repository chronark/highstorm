"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { duration } from "@/lib/time"
import { Ghost } from "lucide-react"
import { getSession } from "@/lib/auth"
import { db } from "@/prisma/db"
import useSWR from "swr"
import { trpc } from "@/lib/trpc"
import React from "react"
import { Loading } from "./loading"


type Props = {
    teamSlug: string
    channelId?: string
    fallback?: React.ReactNode
}
export const Feed: React.FC<Props> = ({ teamSlug, channelId, fallback }) => {


    const { data, error, isLoading } = useSWR({ teamSlug, channelId }, trpc.event.list.query, { refreshInterval: 15000 })
    console.log(data, error, isLoading)


    const feed: Record<
        string,
        { id: string, event: string, content: string | null, time: number, metadata?: Record<string, string | number | boolean | null> }[]
    > = {}
    data?.data
        .sort((a, b) => b.time - a.time)
        .forEach((e) => {
            const key = new Date(e.time).toDateString()
            if (!feed[key]) {
                feed[key] = []
            }
            feed[key].push(e)
        })




    return (
        <div className="border border-neutral-300 rounded-md bg-neutral-50 overflow-hidden">

            {isLoading ? (<div className="h-[60vh] animate-pulse flex items-center justify-center">
                <Loading />
            </div>) : data && data.data.length === 0 ? fallback : (


                <ScrollArea className="max-h-[60vh]">
                    {Object.keys(feed).map((day) => (
                        <div key={day} className="relative">
                            <div className="sticky top-0 z-10 bg-neutral-200  px-4 py-1 text-sm font-medium text-neutral-800">
                                <h3>{day}</h3>
                            </div>
                            <ul
                                role="list"
                                className="relative divide-y divide-neutral-200"
                            >



                                {feed[day].map((event) => (
                                    <li
                                        key={event.id}

                                    >
                                        <Dialog>
                                            <DialogTrigger className="w-full relative bg-neutral-50 px-4 py-3  hover:bg-white">
                                                <div className="flex justify-between  space-x-3">
                                                    <div className="min-w-0 flex-1 text-left">
                                                        <div className="block focus:outline-none">
                                                            <p className="truncate text-sm font-medium text-gray-900">
                                                                {event.event}
                                                            </p>
                                                            <p className="truncate text-sm text-gray-500">
                                                                {event.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <time
                                                        dateTime={new Date(event.time).toISOString()}
                                                        className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                                    >
                                                        {duration(Date.now() - event.time)} ago
                                                    </time>


                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{event.event}</DialogTitle>


                                                    <DialogDescription>
                                                        {event.content}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="text-neutral-700 grid grid-cols-2 gap-2">

                                                    {Object.entries(event.metadata ?? {}).map(([key, value]) => (
                                                        <>
                                                            <span className="text-sm font-mono text-neutral-400">{key}</span>
                                                            <span className="text-sm font-mono text-neutral-600">{value}</span>
                                                        </>
                                                    ))}
                                                </div>
                                                <div className="border-t border-neutral-100 justify-between flex items-center gap-4 mt-4 pt-4">
                                                    <span className="text-xs text-neutral-400">{new Date(event.time).toUTCString()}</span>
                                                    <span className="text-xs font-mono text-neutral-400">{event.id}</span>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                    }
                </ScrollArea>
            )}
        </div>

    )
}