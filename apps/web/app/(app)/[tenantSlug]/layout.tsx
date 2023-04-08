import Link from "next/link";
import { BarChart, Filter, FormInput, Tornado } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeamSwitcher } from "./TeamSwitcher";
import { auth } from "@clerk/nextjs/app-beta";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import { ChannelLink } from "../channelLink";

interface LayoutProps {
  children: React.ReactNode;
  params: { tenantSlug: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { userId, orgId } = auth();

  const tenantId = orgId ?? userId;
  if (!tenantId) {
    return notFound();
  }

  const channels = await db.channel.findMany({
    where: {
      tenantId,
    },
  });

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="container">
        <div className="transition-all dark:bg-neutral-900">
          <div className="grid grid-cols-4 xl:grid-cols-5">
            <aside className="relative min-h-screen pb-12 ">
              <div className="px-8 py-6">
                <p className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                  <Tornado />
                  Highstorm
                </p>
              </div>
              <div className="space-y-4">
                <div className="mx-6">
                  <TeamSwitcher slug={params.tenantSlug} />
                </div>
                <div className="px-6 py-2">
                  <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">{/* Events */}</h2>
                  <div className="space-y-1">
                    <Link href={`/${params.tenantSlug}/stream`}>
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        <FormInput className="w-4 h-4 mr-2" />
                        Stream
                      </Button>
                    </Link>
                    <Button variant="ghost" disabled size="sm" className="justify-start w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="ghost" disabled size="sm" className="justify-start w-full">
                      <BarChart className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
                <div className="py-2">
                  <h2 className="relative px-8 text-lg font-semibold tracking-tight">Events</h2>
                  <ScrollArea className="h-[230px] px-4">
                    <div className="p-2 space-y-1">
                      {channels.map((channel) => (
                        <ChannelLink
                          key={channel.name}
                          href={`/${params.tenantSlug}/${channel.name}`}
                          channelName={channel.name}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </aside>
            <main className="col-span-3 border-l border-l-neutral-200 dark:border-l-neutral-700 xl:col-span-4">
              <div className="h-full px-8 py-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
