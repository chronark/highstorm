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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Keyboard, Mail, Menu, MessageSquare, MoreVertical, PlusCircle, Settings, Settings2, Trash, User, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Feed } from "@/components/feed";
import { DeleteChannelButton } from "./deleteChannelButton";
import { NavLink } from "@/app/(app)/[teamSlug]/[channelName]/nav-link";

export default async function Layout(props: {
    params: { teamSlug: string; channelName: string }, children: React.ReactNode
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
        return redirect(`/${props.params.teamSlug}`)
    }



    return (
        <div className="h-full  py-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {channel.name}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {channel.description}
                    </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <NavLink href={`/${props.params.teamSlug}/${props.params.channelName}`} segment={null}>Analytics</NavLink>
                    <NavLink href={`/${props.params.teamSlug}/${props.params.channelName}/logs`} segment="logs">Logs</NavLink>

                    <Dialog>


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="square"
                                >
                                    <Menu className="w-5 h-5" />
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
                                    <DeleteChannelButton channelId={channel.id} />
                                </DialogFooter>
                            </DialogHeader>
                        </DialogContent>

                    </Dialog>
                </div>
            </div>

            {props.children}
        </div >
    )
}
