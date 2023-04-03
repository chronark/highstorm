import Link from "next/link"
import { redirect } from "next/navigation"
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
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { getSession } from "@/lib/auth"
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
import { NavLink } from "@/app/(app)/[teamSlug]/[channelName]/nav-link"
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
  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return redirect("/auth/sign-in")
  }
  const teams = await db.team.findMany()
  const channels = await db.channel.findMany()
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1">
        <div className="bg-white  transition-all dark:bg-neutral-900">
          <div className="grid grid-cols-4 xl:grid-cols-5">
            <aside className="pb-12">
              <div className="px-8 py-6">
                <p className="flex items-center text-2xl font-semibold tracking-tight">
                  {/* Bivrost */}
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
                        <ChannelLink key={channel.name} href={`/${params.teamSlug}/${channel.name}`}  channelName={channel.name}/>
                         

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
                      {teams.map((team) => (
                        <Link href={`/${team.slug}`}>
                          <Button
                            variant={
                              params.teamSlug === team.slug ? "subtle" : "ghost"
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
            <div className="col-span-3 border-l border-l-neutral-200 dark:border-l-neutral-700 xl:col-span-4">
              <div className="h-full px-8 py-6">
                <div className="space-between flex items-center">
                  <div className="ml-auto mr-4">
                    <h3 className="text-sm font-semibold">{user.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar>
                          {user.image ? (
                            <AvatarImage src={user.image} alt={user.name} />
                          ) : null}
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Billing</span>
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Keyboard className="mr-2 h-4 w-4" />
                          <span>Keyboard shortcuts</span>
                          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Team</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Invite users</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent forceMount>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Email</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>Message</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>More...</span>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
