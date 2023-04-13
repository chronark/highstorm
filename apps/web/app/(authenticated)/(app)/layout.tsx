import Link from "next/link";
import { BarChart, FileKey, Filter, FormInput, Keyboard, Menu, Tornado } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeamSwitcher } from "./TeamSwitcher";
import { auth } from "@clerk/nextjs/app-beta";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import { ChannelLink } from "./channelLink";
import { Logo } from "@/components/logo";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileNav } from "@/components/mobile-nav";
import { MobileSidebar } from "./MobileSidebar";
import { getTenantId } from "@/lib/auth";
import { ReactQueryProvider } from "./react-query-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const tenantId = getTenantId();

  const channels = await db.channel.findMany({
    where: {
      tenantId,
    },
  });

  return (
    <ReactQueryProvider>
      <DesktopSidebar channels={channels.map((c) => ({ name: c.name }))} navigation={[]} />

      <MobileSidebar channels={channels.map((c) => ({ name: c.name }))} navigation={[]} />

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </ReactQueryProvider>
  );
}
