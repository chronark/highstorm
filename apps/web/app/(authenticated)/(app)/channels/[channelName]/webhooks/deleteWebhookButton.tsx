"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

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
  webhookId: string;
};
export const DeleteWebhookButton: React.FC<Props> = ({ webhookId }) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
          <Trash className="w-3 h-3" />
          <span className="text-sm">Delete</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Webhook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Webhook? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);

                  await trpc.webhook.delete.mutate({ webhookId });

                  router.refresh();
                } catch (e) {
                  toast({
                    title: "Error deleting webhoo",
                    description: (e as Error).message,
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <Loading /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
