import Link from "next/link";
import { redirect } from "next/navigation";
import { NavLink } from "@/app/(app)/[tenantSlug]/[channelName]/nav-link";
import { db } from "@/prisma/db";
import {
  CreditCard,
  Keyboard,
  Mail,
  Menu,
  MessageSquare,
  MoreVertical,
  PlusCircle,
  Settings,
  Settings2,
  Trash,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { auth } from "@clerk/nextjs/app-beta";
import { getChannelActivity } from "@/lib/tinybird";
import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/dropdown-menu";
import { DeleteChannelButton } from "./deleteChannelButton";
import { CreateReportButton } from "./createReportButton";
import { Navbar } from "./navbar";

export default async function Layout(props: {
  params: { tenantSlug: string; channelName: string };
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/auth/sign-in");
  }

  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          slug: props.params.tenantSlug,
        },
        name: props.params.channelName,
      },
    },
    include: {
      tenant: true,
    },
  });
  if (!channel) {
    console.log("Channel not found, redirecting to tenant page");
    return redirect(`/${props.params.tenantSlug}`);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{channel.name}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{channel.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Navbar channelName={channel.name} tenantSlug={channel.tenant.slug ?? "personal"} />

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="square">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Channel Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <CreateReportButton
                    channelId={channel.id}
                    channelName={channel.name}
                    tenantSlug={channel.tenant.slug ?? "personal"}
                  />
                </DropdownMenuGroup>
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
          </Dialog>
        </div>
      </div>

      {props.children}
    </div>
  );
}
