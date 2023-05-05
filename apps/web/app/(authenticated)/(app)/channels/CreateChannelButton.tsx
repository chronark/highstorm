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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

type Props = {};

export const CreateChannelButton: React.FC<Props> = () => {
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const router = useRouter();

  const create = trpc.channel.create.useMutation({
    onSuccess() {
      toast({
        title: "Channel Created",
        description: "Your channel has been created",
      });
      router.refresh();
    },
    onError(err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>Create Channel</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Create a new channel</DialogTitle>
          <DialogDescription>
            Channel names must be alphanumeric and can include underscores, dashes and periods.
          </DialogDescription>

          <form>
            <Label htmlFor="name">Channel Name</Label>
            <Input id="name" value={name} onChange={(v) => setName(v.target.value)} />
          </form>

          <DialogFooter className="justify-end">
            <Button
              onClick={(e) => {
                e.preventDefault();
                create.mutate({ name });
              }}
            >
              {" "}
              {create.isLoading ? <Loading /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
