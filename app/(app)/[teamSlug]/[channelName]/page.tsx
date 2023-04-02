import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { AppleMusicDemo } from "@/components/apple-music-demo"
// import { CopyButton } from "@/components/copy-button"
import { Icons } from "@/components/icons"
import { PromoVideo } from "@/components/promo-video"
import { buttonVariants } from "@/components/ui/button"
import { Menubar, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarRadioGroup, MenubarRadioItem, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarSeparator, MenubarTrigger, MenubarShortcut } from "@/components/ui/menubar"
import { CreditCard, Globe, Hash, Keyboard, LayoutGrid, LayoutList, Library, List, ListMusic, LogOut, Mail, MessageSquare, Mic, Mic2, Music, Music2, PlayCircle, Plus, PlusCircle, Podcast, Radio, Settings, Shuffle, User, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { db } from "@/prisma/db"
import type { Event } from "@/prisma/db"
import { useTheme } from "next-themes"
import { notFound } from "next/navigation"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuCheckboxItem, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu"



export default async function IndexPage(props: { params: { channelName: string } }) {


    const channel = await db.channel.findUnique({
        where: {
            teamId_name: {
                teamId: "team_1",
                name: props.params.channelName,
            }
        },
        include: {
            events: true
        }
    })
    if (!channel) {
        return notFound()
    }


    const events: Record<string, Event[]> = {}
    channel.events.sort((a, b) => a.time.getTime() - b.time.getTime()).forEach((e) => {
        const key = e.time.toDateString()
        if (!events[key]) {
            events[key] = []
        }
        events[key].push(e)
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
            </div>
            <Separator className="my-4" />
            <div className="relative">
                <div className="overflow-y-auto h-full">
                    {Object.keys(events).map((day) => (
                        <div key={day} className="relative">
                            <div className="sticky top-0 z-10 border border-neutral-300 rounded-md bg-neutral-50 px-6 py-1 text-sm font-medium text-neutral-500">
                                <h3>{day}</h3>
                            </div>
                            <ul role="list" className="relative z-0 divide-y divide-neutral-200">
                                {events[day].map((event) => (
                                    <li
                                        key={event.id}
                                        className="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between space-x-3">
                                            <div className="min-w-0 flex-1">
                                                <a href="#" className="block focus:outline-none">
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                    <p className="truncate text-sm font-medium text-gray-900">{event.event}</p>
                                                    <p className="truncate text-sm text-gray-500">{event.content}</p>
                                                </a>
                                            </div>
                                            <time dateTime={event.time.toISOString()} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                                                {event.time.toLocaleTimeString()}
                                            </time>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>


        </div>


    )
}