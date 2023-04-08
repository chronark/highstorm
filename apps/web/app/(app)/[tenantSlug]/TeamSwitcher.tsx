"use client";

import {
  DialogContent,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { trpc } from "@/lib/trpc";
import { Check, ChevronsUpDown, Plus, Key, Book, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Loading } from "@/components/loading";
import { Plan } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useAuth, useOrganization, useOrganizationList, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
type Props = {
  slug: string;
};

export const TeamSwitcher: React.FC<Props> = ({ slug }): JSX.Element => {
  const { setActive, organizationList, isLoaded } = useOrganizationList();
  const { signOut } = useAuth();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    try {
      setLoading(true);

      if (slug === "home") {
        setActive({ organization: null });
        return;
      }

      if (organizationList.length === 0) {
        return;
      }

      const o = organizationList.find((org) => org.organization.slug === slug);
      if (o) {
        setActive({ organization: o.organization.id });

        return;
      }
    } finally {
      setLoading(false);
    }
  }, [organizationList, isLoaded, slug]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({ reValidateMode: "onSubmit" });

  const _submit = async (_data: { name: string }) => {
    setLoading(true);

    try {
      // const team = await trpc.team.create.mutate({
      //   name: data.name,
      // });
      // router.push(`/${team.slug}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      {loading ? (
        <Loading />
      ) : (
        <DropdownMenuTrigger className="flex items-center justify-between w-full gap-4 px-2 py-1 rounded hover:bg-zinc-100">
          <div className="flex items-center justify-start w-full gap-4 ">
            <Avatar>
              {user?.profileImageUrl ? (
                <AvatarImage src={user.profileImageUrl} alt={user.username ?? "Profile picture"} />
              ) : null}
              <AvatarFallback className="flex items-center justify-center w-8 h-8 overflow-hidden border rounded-md bg-emerald-100 border-emerald-500 text-emerald-700">
                {slug.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>
              {slug === "home"
                ? "Personal"
                : organizationList?.find((o) => o.organization.slug === slug)?.organization.name}
            </span>
          </div>
          {/* <PlanBadge plan={currentTeam?.plan ?? "DISABLED"} /> */}
          <ChevronsUpDown className="w-4 h-4" />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuGroup>
            {/* <DropdownMenuItem>
                                <User className="w-4 h-4 mr-2" />
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard className="w-4 h-4 mr-2" />
                                <span>Billing</span>
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem> */}
            <Link href={`/${slug}/keys`}>
              <DropdownMenuItem>
                <Key className="w-4 h-4 mr-2" />
                <span>API Keys</span>
              </DropdownMenuItem>
            </Link>
            <Link href="https://highstorm-docs.vercel.app/" target="_blank">
              <DropdownMenuItem>
                <Book className="w-4 h-4 mr-2" />
                <span>Docs</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch Teams</DropdownMenuLabel>

          <Link href={"/home"}>
            <DropdownMenuItem
              className={cn("flex items-center justify-between", {
                "bg-zinc-100": slug === "home",
              })}
            >
              <span>Personal</span>
              {slug === "home" ? <Check className="w-4 h-4" /> : null}
            </DropdownMenuItem>
          </Link>

          {organizationList?.map((org) => (
            <Link href={`/${org.organization.slug}`}>
              <DropdownMenuItem
                className={cn("flex items-center justify-between", {
                  "bg-zinc-100": slug === org.organization.slug,
                })}
              >
                <span>{org.organization.name}</span>
                {slug === org.organization.slug ? <Check className="w-4 h-4" /> : null}
              </DropdownMenuItem>
            </Link>
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
            <button onClick={() => signOut()} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
