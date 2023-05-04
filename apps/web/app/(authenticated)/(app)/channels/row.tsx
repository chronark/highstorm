"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Book, Key, MoreVertical, Rocket, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DeleteChannelButton } from "./[channelName]/deleteChannelButton";

type Props = {
  channel: {
    id: string;
    name: string;

    createdAt: Date;
  };
};

export const Row: React.FC<Props> = ({ channel }) => {
  return (
    <Link
      key={channel.id}
      href={`/channels/${channel.name}`}
      className="flex items-center justify-between px-4 py-5 duration-1000 gap-x-6 md:px-6 lg:px-8 hover:bg-zinc-800 "
    >
      <div>
        <p className="text-zinc-200 whitespace-nowrap">{channel.name}</p>
        <div className="flex items-center mt-1 text-xs leading-5 gap-x-2 text-zinc-500">
          <p className="whitespace-nowrap">
            Created at{" "}
            <time dateTime={channel.createdAt.toISOString()}>
              {channel.createdAt.toUTCString()}
            </time>
          </p>
        </div>
      </div>

      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="sm">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full lg:w-56" align="end" forceMount>
            <DropdownMenuGroup>
              <Link href={`/channels/${channel.name}`}>
                <DropdownMenuItem>
                  <Key className="w-4 h-4 mr-2" />
                  <span>Details</span>
                </DropdownMenuItem>
              </Link>

              <DeleteChannelButton channelId={channel.id}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    // This magically allows multiple dialogs in a dropdown menu, no idea why
                    e.preventDefault();
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span>Revoke</span>
                </DropdownMenuItem>
              </DeleteChannelButton>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </Link>
  );
};
