import { notFound, redirect } from "next/navigation"
import { Event, db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { getChannelActivity } from "@/lib/tinybird";
import { Chart } from "./chart";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Keyboard, Mail, MessageSquare, MoreVertical, PlusCircle, Settings, Settings2, Trash, User, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function IndexPage(props: {
    params: { teamSlug: string; channelName: string }
}) {
    const { session } = await getSession()

    if (!session) {
        return redirect("/auth/sign-in")
    }

    const channel = await db.channel.findFirst({
        where: {
            AND: {
                team: {
                    slug: props.params.teamSlug,
                },
                name: props.params.channelName,
            },
        },
        include: {
            events: true,
            team: true,
        },
    })
    if (!channel) {
        return notFound()
    }

    const events: Record<
        string,
        Event[]
    > = {}
    channel.events
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .forEach((e) => {
            const key = e.time.toDateString()
            if (!events[key]) {
                events[key] = []
            }
            events[key].push(e)
        })

    const activity = await getChannelActivity({
        teamId: channel.team.id,
        channelId: channel.id,
        since: Date.now() - 1000 * 60 * 60 * 24,
        granularity: "1h",
    })

    return (
        <div className="h-full px-8 py-6">

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {channel.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {channel.description}
                    </p>
                </div>
                <Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className=""
                            >
                                Settings
                                <MoreVertical className="ml-2 h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                        >
                            <DropdownMenuLabel>Channel Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DialogTrigger className="w-full">
                                    <DropdownMenuItem >
                                        <Trash className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>

                                </DialogTrigger>



                            </DropdownMenuGroup>


                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete this channel
                                and remove your data from our servers.
                            </DialogDescription>
                            <DialogFooter>
                                <Button variant="destructive">TODO</Button>
                            </DialogFooter>
                        </DialogHeader>
                    </DialogContent>

                </Dialog>

            </div>

            <div className="h-32 mt-4 border border-neutral-300 rounded-md bg-neutral-50 py-2">

                <Chart data={activity.data} />
            </div>
            <div className="relative mt-8 border border-neutral-300 rounded-md bg-neutral-50 overflow-hidden">
                <ScrollArea className="max-h-[80vh] ">

                    {Object.keys(events).map((day) => (
                        <div key={day} className="relative">
                            <div className="sticky top-0 z-10 bg-neutral-200  px-4 py-1 text-sm font-medium text-neutral-700">
                                <h3>{day}</h3>
                            </div>
                            <ul
                                role="list"
                                className="relative divide-y divide-neutral-200"
                            >
                                {events[day].map((event) => (
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
                                                                {event.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <time
                                                        dateTime={event.time.toISOString()}
                                                        className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                                                    >
                                                        {event.time.toLocaleTimeString()}
                                                    </time>


                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{event.event}</DialogTitle>


                                                    <DialogDescription>
                                                        {event.description}
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
                                                    <span className="text-xs text-neutral-400">{new Date(event.time).toLocaleString()}</span>
                                                    <span className="text-xs font-mono text-neutral-400">{event.id}</span>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    )
}
