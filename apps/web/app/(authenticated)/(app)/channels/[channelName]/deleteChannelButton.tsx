"use client";

import React, { PropsWithChildren, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { trpc } from "@/lib/trpc";
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

type Props = {
  channelId: string;
};
export const DeleteChannelButton: React.FC<PropsWithChildren<Props>> = ({
  channelId,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Channel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this channel? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);

                  await trpc.channel.delete.mutate({ channelId });

                  router.refresh();
                  toast({
                    title: "Key deleted",
                  });
                } catch (e) {
                  toast({
                    title: "Error deleting channel",
                    description: (e as Error).message,
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <Loading /> : "Delete Channel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
