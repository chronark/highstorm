"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { trpc } from "@/lib/trpc/client";
import { CopyButton } from "@/components/copy-button";
import { Loading } from "@/components/loading";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Props = {
  channels: {
    id: string;
    name: string;
  }[];
};

const actions = ["create", "read", "update", "delete", "ingest"] as const;
type Action = typeof actions[number];

type FormData = {
  [channelId: string]: {
    [action in Action]: boolean;
  };
};

export const CreateKeyButton: React.FC<Props> = ({ channels }) => {
  const { toast } = useToast();

  const [name, setName] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    channels.reduce((acc, channel) => {
      acc[channel.id] = {
        create: false,
        read: false,
        update: false,
        ingest: false,
        delete: false,
      };
      return acc;
    }, {} as FormData),
  );

  const key = trpc.apikey.create.useMutation({
    onError(err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  function updatePermission(channelId: string, action: Action, allowed: boolean) {
    setForm({
      ...form,
      [channelId]: {
        ...form[channelId],
        [action]: allowed,
      },
    });
  }

  const snippet = `curl 'https://highstorm.app/api/v1/events/user.signup' \\
  -H 'Authorization: Bearer ${key.data?.apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event": "Chronark has signed up",
    "content": "A new user has signed up",
    "metadata": {"userId": "123"}
  }'
  `;

  return (
    <>
      <Dialog
        onOpenChange={(v) => {
          if (!v) {
            // Remove the key from memory when closing the modal
            key.reset();
            router.refresh();
          }
        }}
      >
        <DialogTrigger>
          <Button>Create Key</Button>
        </DialogTrigger>

        {key.data ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your API Key</DialogTitle>
              <DialogDescription>
                This key is only shown once and can not be recovered. Please store it somewhere
                safe.
              </DialogDescription>
              <div>
                {key.data.root ? (
                  <Alert variant="warn" className="my-4">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Root Key Generated</AlertTitle>
                    <AlertDescription>
                      The root key will provide full read and write access to all current and future
                      resources.
                      <br />
                      For production use, we recommend creating a key with only the permissions you
                      need.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>

              <div className="flex items-center justify-between px-2 py-1 mt-4 border rounded  gap-4 lg:p-4 border-white/10 bg-zinc-100 dark:bg-zinc-900">
                <pre className="font-mono">{key.data.apiKey}</pre>
                <CopyButton value={key.data.apiKey} />
              </div>
            </DialogHeader>

            <p className="mt-2 text-sm font-medium text-center text-zinc-100 ">
              Try it out with curl
            </p>
            <div className="flex items-start justify-between px-2 py-1 border rounded gap-4 lg:p-4 border-white/10  bg-zinc-100 dark:bg-zinc-900">
              <pre className="font-mono">{snippet}</pre>
              <CopyButton value={snippet} />
            </div>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogTitle>Create a new API key</DialogTitle>
            <DialogDescription>
              Choose the channels and permissions this key should provide.
              <br />

              <HoverCard>
                <HoverCardTrigger className="flex items-center mt-2 gap-2">
                  <Info className="w-4 h-4" /> What do these permissions mean?
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col w-full gap-2 lg:gap-8">
                  <div>
                    <p className="font-semibold text-zinc-200">Create</p>
                    <p className="text-sm text-zinc-400">
                      Tokens with this permission can create new channels.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">Read</p>
                    <p className="text-sm text-zinc-400">
                      Tokens with this permission can read a channel's configuration and events.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">Update</p>
                    <p className="text-sm text-zinc-400">
                      Tokens with this permission can update the configuration of existing channels.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">Delete</p>
                    <p className="text-sm text-zinc-400">
                      Tokens with this permission can delete existing channels.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">Ingest</p>
                    <p className="text-sm text-zinc-400">
                      Tokens with this permission can create events to a channel.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </DialogDescription>

            <div className="flex flex-col mt-4 space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Give this key a name if you want"
                value={name ?? undefined}
                onChange={(v) => setName(v.currentTarget.value)}
              />
            </div>

            <ul className="divide-y divide-white/10">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between w-full py-6 ">
                  <span className="text-sm font-medium text-white leading-6">{channel.name}</span>
                  <div className="flex items-center text-sm text-zinc-400 justify-right gap-4">
                    {actions.map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${channel.id}-${action}`}
                          onCheckedChange={(v) => {
                            updatePermission(channel.id, action, Boolean(v));
                          }}
                        />
                        <Label htmlFor={`${channel.id}-${action}`}>{action}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ul>
            <DialogFooter className="flex items-center justify-between gap-2 ">
              <HoverCard>
                <HoverCardTrigger>
                  <Button
                    variant={"subtle"}
                    onClick={() =>
                      key.mutate({
                        name: name ?? "default",
                        permissions: { channels: "*" },
                      })
                    }
                  >
                    {key.isLoading ? <Loading /> : "Create Root Key"}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-full">
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Root keys can be dangerous</AlertTitle>
                    <AlertDescription>
                      The root key will provide full read and write access to all current and future
                      resources.
                      <br />
                      For production use, we recommend creating a key with only the permissions you
                      need.
                    </AlertDescription>
                  </Alert>
                </HoverCardContent>
              </HoverCard>
              <Button
                onClick={() =>
                  key.mutate({
                    name: name ?? "default",
                    permissions: { channels: form },
                  })
                }
                disabled={key.isLoading || channels.length === 0}
              >
                {key.isLoading ? <Loading /> : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
