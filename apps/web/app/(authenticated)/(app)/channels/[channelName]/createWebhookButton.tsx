"use client";

import React, { PropsWithRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FileClock, Webhook } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
type Props = {
  channelName: string;
  channelId: string;
};

const formValidation = z.object({
  method: z.enum(["POST", "GET", "PUT", "DELETE"]),
  url: z.string().url(),
  type: z.enum(["HTTP", "SLACK"]),
  headers: z.string(),
});

export const CreateWebhookButton = React.forwardRef<any, Props>(
  ({ channelId, channelName }, _ref) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const { register, handleSubmit, formState, watch } = useForm<z.infer<typeof formValidation>>({
      resolver: zodResolver(formValidation),
      defaultValues: {
        method: "POST",
        type: "SLACK",
      },
    });

    const create = trpc.webhook.create.useMutation({
      onSuccess() {
        setOpen(false);
        toast({ title: "Webook created" });

        router.push(`/channels/${channelName}/webhooks`);
      },
      onError(err) {
        console.error(err);
        toast({ title: "Error", description: "Unable to create report", variant: "destructive" });
      },
    });

    const onSubmit = handleSubmit(async (data) => {
      await create.mutateAsync({
        channelId,
        headers: JSON.parse(data.headers ?? "{}"),
        method: data.method,
        type: data.type,
        url: data.url,
      });
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Webhook className="w-4 h-4 mr-2" />
            <span>Create Webhook</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Create Report</DialogTitle>
              <DialogDescription>
                Whenever a new event is created, we will forward it to the webhook URL you provide.
              </DialogDescription>
              <div className="py-2 flex flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" defaultValue="SLACK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="SLACK">Slack</SelectItem>
                      <SelectItem value="HTTP">Http</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formState.errors.type ? (
                  <p className="text-red-500">{formState.errors.type.message}</p>
                ) : null}
              </div>
              <div className="py-2 flex flex-col gap-2">
                <Label htmlFor="slackUrl">Slack Webhook URL</Label>

                <Input type="url" {...register("url")} />
                {formState.errors.url ? (
                  <p className="text-red-500">{formState.errors.url.message}</p>
                ) : null}
              </div>
              <div className="py-2 flex flex-col gap-2">
                <Label htmlFor="timeframe">Add optional http headers (Must be valid JSON)</Label>

                <Textarea {...register("headers")} />
                {formState.errors.headers ? (
                  <p className="text-red-500">{formState.errors.headers.message}</p>
                ) : null}
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">{create.isLoading ? <Loading /> : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);

CreateWebhookButton.displayName = "CreateWebhookButton";
