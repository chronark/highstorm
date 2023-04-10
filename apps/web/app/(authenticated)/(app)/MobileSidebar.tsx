"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, FileKey, Filter, FormInput, Menu } from "lucide-react";
import { ChannelLink } from "./channelLink";
import { TeamSwitcher } from "./TeamSwitcher";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
type Props = {
  navigation: {
    href: string;
    external?: boolean;
    label: string;
  }[];

  channels: {
    name: string;
  }[];
};

export const MobileSidebar: React.FC<Props> = ({ navigation, channels }) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <div className="sticky top-0 z-40 flex items-center justify-end w-full px-4 py-4 bg-neutral-950 gap-x-6 sm:px-6 lg:hidden">
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
        </div>
        <SheetContent position="bottom" size="content">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-center gap-2">
              {" "}
              <Logo className="w-8 h-8 stroke-neutral-300" />
              Highstorm
            </SheetTitle>
            {/* <SheetDescription>
                            Make changes to your profile here. Click save when you're done.
                        </SheetDescription> */}
          </SheetHeader>
          <div className="space-y-4">
            <div className="px-6 py-2">
              <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">{/* Events */}</h2>
              <div className="space-y-1">
                <Link href="/home">
                  <Button variant="ghost" size="sm" className="justify-start w-full">
                    <FormInput className="w-4 h-4 mr-2" />
                    Stream
                  </Button>
                </Link>
                <Link href="/keys">
                  <Button variant="ghost" size="sm" className="justify-start w-full">
                    <FileKey className="w-4 h-4 mr-2" />
                    API Keys
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
                      href={`/channels/${channel.name}`}
                      channelName={channel.name}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <SheetFooter>
            <TeamSwitcher />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
