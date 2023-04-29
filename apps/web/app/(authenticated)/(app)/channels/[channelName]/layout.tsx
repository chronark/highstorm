import { redirect } from "next/navigation";
import { db } from "@/prisma/db";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteChannelButton } from "./deleteChannelButton";
import { CreateReportButton } from "./createReportButton";
import { getTenantId } from "@/lib/auth";
import { CreateWebhookButton } from "./createWebhookButton";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Navbar } from "./navbar";
import { currentUser } from "@clerk/nextjs/app-beta";
import { auth } from "@clerk/nextjs/app-beta";
import { Header } from "./header";
export default async function Layout(props: {
  params: { tenantSlug: string; channelName: string };
  children: React.ReactNode;
}) {
  const tenantId = getTenantId();
  const _user = auth();

  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          id: tenantId,
        },
        name: props.params.channelName,
      },
    },
    include: {
      tenant: true,
    },
  });
  if (!channel) {
    return redirect("/overview");
  }

  return (
    <div className="">
      {props.children}
      {/* <div className="my-8 lg:my-16">{props.children}</div>{" "} */}
    </div>
  );
}
