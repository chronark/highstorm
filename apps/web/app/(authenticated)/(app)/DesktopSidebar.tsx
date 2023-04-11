import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, FileKey, Filter, FormInput, Home } from "lucide-react";
import { ChannelLink } from "./channelLink";
import { TeamSwitcher } from "./TeamSwitcher";
import Link from "next/link";
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

export const DesktopSidebar: React.FC<Props> = ({ navigation, channels }) => {
  return (
    <aside className="relative hidden min-h-screen pb-12 border-r lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-neutral-800">
      <Link
        href="/home"
        className="flex items-center gap-2 px-8 py-6 text-2xl font-semibold tracking-tight duration-200 stroke-neutral-800 dark:text-neutral-200 dark:stroke-neutral-500 dark:hover:stroke-white hover:stroke-neutral-700 hover:text-neutral-700 dark:hover:text-white"
      >
        <Logo className="w-8 h-8 duration-200 " />
        Highstorm
      </Link>
      <div className="space-y-4">
        <div className="px-6 py-2">
          <h2 className="px-2 mb-2 text-lg font-semibold tracking-tight">{/* Events */}</h2>
          <div className="space-y-1">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="justify-start w-full">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/stream">
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
      <div className="absolute inset-x-0 mx-6 bottom-8">
        <TeamSwitcher />
      </div>
    </aside>
  );
};
