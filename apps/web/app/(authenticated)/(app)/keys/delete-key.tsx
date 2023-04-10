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
  keyId: string;
};
export const DeleteKeyButton: React.FC<Props> = ({ keyId }) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <Dialog>
        <DialogTrigger className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
          <Trash className="w-3 h-3" />
          <span className="text-sm">Revoke</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);

                  await trpc.apikey.delete.mutate({ keyId });

                  router.refresh();
                } catch (e) {
                  toast({
                    title: "Error deleting key",
                    description: (e as Error).message,
                    variant: "destructive",
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <Loading /> : "Delete Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
