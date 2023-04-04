import Link from "next/link"
import { redirect } from "next/navigation"
import { NavLink } from "@/app/(app)/[teamSlug]/[channelName]/nav-link"
import { db } from "@/prisma/db"
import {
  BarChart,
  CreditCard,
  Filter,
  FormInput,
  Hash,
  Keyboard,
  LayoutList,
  List,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  Tornado,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChannelLink } from "./channelLink"

interface RootLayoutProps {
  children: React.ReactNode
  params: { teamSlug: string }
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { session } = await getSession()

  if (!session) {
    return redirect("/auth/sign-in")
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      teams: {
        include: {
          team: {
            include: {
              channels: true,
            },
          },
        },
      },
    },
  })
  if (!user) {
    return redirect("/auth/sign-in")
  }
  if (!user.teams.find((team) => team.team.slug === params.teamSlug)) {
    return redirect("/auth/sign-in")
  }
  const channels =
    user.teams.find((team) => team.team.slug === params.teamSlug)?.team
      .channels ?? []
  return (
    <div className="flex min-h-screen flex-col ">
      <div className="container">
        <div className="transition-all dark:bg-neutral-900">
          <div className="grid grid-cols-4 xl:grid-cols-5">
            <aside className="pb-12 ">
              <div className="px-8 py-6">
                <p className="flex items-center text-2xl font-semibold tracking-tight gap-2">
                  <Tornado />
                  Highstorm
                </p>
              </div>
              <div className="space-y-4">
                {/* <div className="px-6 py-2">
                            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                                Discover
                            </h2>
                            <div className="space-y-1">
                                <Button
                                    variant="subtle"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    Listen Now
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    Browse
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Radio className="mr-2 h-4 w-4" />
                                    Radio
                                </Button>
                            </div>
                        </div> */}
                <div className="px-6 py-2">
                  <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    {/* Events */}
                  </h2>
                  <div className="space-y-1">
                    <Link href={`/${params.teamSlug}/stream`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <FormInput className="mr-2 h-4 w-4" />
                        Stream
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      disabled
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button
                      variant="ghost"
                      disabled
                      size="sm"
                      className="w-full justify-start"
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </div>
                </div>
                <div className="py-2">
                  <h2 className="relative px-8 text-lg font-semibold tracking-tight">
                    Events
                  </h2>
                  <ScrollArea className="h-[230px] px-4">
                    <div className="space-y-1 p-2">
                      {channels.map((channel) => (
                        <ChannelLink
                          key={channel.name}
                          href={`/${params.teamSlug}/${channel.name}`}
                          channelName={channel.name}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="py-2">
                  <h2 className="relative px-8 text-lg font-semibold tracking-tight">
                    Teams
                  </h2>
                  <ScrollArea className="h-[230px] px-4">
                    <div className="space-y-1 p-2">
                      {user.teams
                        .map((t) => t.team)
                        .map((team) => (
                          <Link href={`/${team.slug}`} key={team.id}>
                            <Button
                              variant={
                                params.teamSlug === team.slug
                                  ? "subtle"
                                  : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start font-normal"
                            >
                              {team.name}
                            </Button>
                          </Link>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </aside>
            <main className="col-span-3 border-l border-l-neutral-200 dark:border-l-neutral-700 xl:col-span-4">
              <div className="h-full px-8 py-6 space-y-8">
                <Navbar
                  team={{
                    slug: params.teamSlug,
                  }}
                  user={{
                    id: user.id,
                    name: user.name,
                    image: user.image,
                  }}
                />

                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
