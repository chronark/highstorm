"use client";

import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
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
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Plus, Key, Book, LogOut, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/loading";
import { Plan } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useAuth, useOrganization, useOrganizationList, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

type Props = {};

export const TeamSwitcher: React.FC<Props> = (): JSX.Element => {
  const { setActive, organizationList } = useOrganizationList();
  const { organization: currentOrg } = useOrganization();

  const { signOut } = useAuth();
  const { user } = useUser();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function changeOrg(id: string | null) {
    if (!setActive) {
      return;
    }
    try {
      setLoading(true);
      await setActive({ organization: id });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      {loading ? (
        <Loading />
      ) : (
        <DropdownMenuTrigger className="flex items-center justify-between w-full px-2 py-1 rounded gap-4 hover:bg-zinc-100 dark:hover:bg-zinc-700">
          <div className="flex items-center justify-start w-full gap-4 ">
            <Avatar>
              {user?.profileImageUrl ? (
                <AvatarImage src={user.profileImageUrl} alt={user.username ?? "Profile picture"} />
              ) : null}
              <AvatarFallback className="flex items-center justify-center w-8 h-8 overflow-hidden border rounded-md bg-zinc-100 border-zinc-500 text-zinc-700">
                {(currentOrg?.slug ?? user?.username ?? "").slice(0, 2).toUpperCase() ?? "P"}
              </AvatarFallback>
            </Avatar>
            <span>{currentOrg?.name ?? "Personal"}</span>
          </div>
          {/* <PlanBadge plan={currentTeam?.plan ?? "DISABLED"} /> */}
          <ChevronsUpDown className="w-4 h-4" />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className="w-full lg:w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <Link href="/onboarding">
            <DropdownMenuItem>
              <Rocket className="w-4 h-4 mr-2" />
              <span>Onboarding</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/docs" target="_blank">
            <DropdownMenuItem>
              <Book className="w-4 h-4 mr-2" />
              <span>Docs</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch Teams</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => changeOrg(null)}
            className={cn("flex items-center justify-between", {
              "bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-100": currentOrg === null,
            })}
          >
            <span>Personal</span>
            {currentOrg === null ? <Check className="w-4 h-4" /> : null}
          </DropdownMenuItem>

          {organizationList?.map((org) => (
            <DropdownMenuItem
              onClick={() => changeOrg(org.organization.id)}
              className={cn("flex items-center justify-between", {
                "bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-100":
                  currentOrg?.slug === org.organization.slug,
              })}
            >
              <span>{org.organization.name}</span>
              {currentOrg?.slug === org.organization.slug ? <Check className="w-4 h-4" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Plus className="w-4 h-4 mr-2" />
            <span>Create Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button
              onClick={async () => {
                await signOut();
                router.refresh();
              }}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
