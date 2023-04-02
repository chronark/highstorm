"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import type { Team } from "@/prisma/db";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { isLength } from "tailwind-merge/dist/lib/validators";
import { initScriptLoader } from "next/script";

type Props = {
  user: {
    id: string;
    name: string;
  };
};

type FormParams = {
  name: string;
  slug: string;
};

function createSlug(s: string): string {
  return slugify(s, { lower: true, trim: true });
}

const slugRegex = /^[a-zA-Z0-9-_]+$/;

export const CreateTeam: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!team) {
      return;
    }
    router.push(`/${team.slug}/endpoints`);
  }, [team, router]);

  const teamForm = useForm<FormParams>({
    defaultValues: {
      name: user.name,
      slug: createSlug(user.name),
    },
  });

  async function submit(data: FormParams) {
    try {
      setLoading(true);
      const newTeam = await fetch("/api/v1/team", { method: "POST", body: JSON.stringify(data) }).then((res) => res.json());

      setTeam(newTeam);
    } catch (err) {

      setError((err as Error).message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {team ? (
        <div>Setup Complete</div>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="default" size="lg">
              Create your Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create your Team</AlertDialogTitle>
            </AlertDialogHeader>

            <form className="flex flex-col  gap-4" onSubmit={teamForm.handleSubmit(submit)}>
              <div className="text-left">
                <Label htmlFor="name">Name</Label>
                <p className="text-sm">
                  This is the visible name within Bivrost app and your invoices.
                </p>
                <div className="mt-1 ">
                  <Input
                    type="text"
                    {...teamForm.register("name", {
                      required: true,
                    })}
                    defaultValue={teamForm.getValues().name}
                  />
                  {teamForm.formState.errors.name ? (
                    <p className="mt-2 text-sm text-red-500">
                      {teamForm.formState.errors.name.message || "A name is required"}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="text-left">
                <Label htmlFor="slug">Slug</Label>
                <p className="text-sm">The slug is your unique namespace on Bivrost.</p>
                <div className="overflow-hidden relative mt-1 flex h-10 w-full rounded border border-zinc-700 bg-transparent  text-sm placeholder:text-zinc-400 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50  ">
                  <span className="inline-flex items-center border-r bg-zinc-50 border-zinc-200 px-3 text-zinc-500 sm:text-sm">
                    https://bivrost.com/
                  </span>
                  <input
                    type="text"
                    {...teamForm.register("slug", {
                      required: true,
                      validate: (value) => slugRegex.test(value),
                    })}
                    defaultValue={createSlug(teamForm.getValues().name)}
                    className="py-2 px-3 w-full focus:outline-none focus:ring-0 focus:border-transparent"
                  />
                </div>
                {teamForm.formState.errors.slug ? (
                  <p className="mt-2 text-sm text-red-500">
                    {teamForm.formState.errors.slug.message ||
                      "Only alphanumeric characters, dashes and underscores are allowed"}
                  </p>
                ) : null}
              </div>
              {error ? <div className="mt-2  text-red-500 text-sm">{error}</div> : null}
              <Button type="submit" variant="default" disabled={loading}>
                Create Team
              </Button>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
