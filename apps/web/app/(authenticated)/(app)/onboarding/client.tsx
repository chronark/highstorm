"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/empty-state";
import { create } from "domain";
import { Loading } from "@/components/loading";
import { CopyButton } from "@/components/copy-button";
import { CardDescription, CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { Particles } from "@/components/landing/particles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  {
    id: "1",
    name: "Create API Key",
    description: "Before sending requests, you need an API key.",
  },
  {
    id: "2",
    name: "Publish an Event",
    description: "Publish your first event to highstorm.",
  },
  {
    id: "3",
    name: "Explore your Channel",
    description: "Check out your new channel.",
  },
];
export const Onboarding: React.FC = () => {
  const user = useUser();
  const [successOpen, setSuccessOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const channels = trpc.channel.list.useQuery(undefined, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (channels.data?.length) {
      setSuccessOpen(true);
      setCurrentStep(2);
    }
  }, [channels.data]);
  const createApiKey = trpc.apikey.create.useMutation({
    onSuccess: (data) => {
      setApiKey(data.apiKey);
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Could not create api Key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const curl = `curl -XPOST 'https://highstorm.app/api/v1/events/user.onboarded' \\
    -H 'Content-Type: application/json' \\
    -H 'Authorization: Bearer ${apiKey}' \\
    -d '{
        "event": "${user.user?.username} onboarded",
        "content": "${user.user?.username} has sent their first event",
        "metadata": {
            "user_id": "${user.user?.id}",
            "user_name": "${user.user?.username}"
        }
    }'`;
  return (
    <div>
      <Dialog open={successOpen} onOpenChange={(v) => setSuccessOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              You have successfully published an event, let's check out the new channel:
            </DialogDescription>
          </DialogHeader>

          <Link href={`/channels/${channels.data?.at(0)?.name}`}>
            <Button>Go to your Channel</Button>
          </Link>
        </DialogContent>
      </Dialog>
      <ol
        role="list"
        className="overflow-hidden rounded-md lg:flex lg:rounded-none  divide-x divide-white/10  border-b border-white/10 bg-primary-900  "
      >
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative overflow-hidden lg:flex-1">
            <Step
              key={step.id}
              id={step.id}
              title={step.name}
              description={step.description}
              state={
                stepIdx < currentStep
                  ? "completed"
                  : stepIdx === currentStep
                  ? "current"
                  : "upcoming"
              }
            />
          </li>
        ))}
      </ol>

      <main className="p-4 md:p-6 lg:p-8">
        {apiKey ? (
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Publish your first event</CardTitle>
                <CardDescription>
                  Let's send an event to Highstorm. A channel{" "}
                  <code className="text-zinc-500">user.onboarded</code> will be automatically
                  created when you send your first event. Copy the curl command below and run it in
                  your terminal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-start justify-between gap-4 px-2 py-1 mt-8 rounded bg-zinc-100 dark:bg-zinc-800">
                    <pre className="font-mono">{curl}</pre>
                    <CopyButton value={curl} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your API Key</CardTitle>
                <CardDescription>
                  Keep it somewhere safe and don't share with anyone. You can revoke and generate
                  new keys at any time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4 px-2 py-1 mt-8 rounded bg-zinc-100 dark:bg-zinc-800">
                  <pre className="font-mono">{apiKey}</pre>
                  <CopyButton value={apiKey} />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <EmptyState
              title="Looks you don't have any API keys yet"
              description="Create one to get started"
            >
              <Button
                onClick={() =>
                  createApiKey.mutate({ name: "default", permissions: { channels: "*" } })
                }
                disabled={createApiKey.isLoading}
              >
                {createApiKey.isLoading ? <Loading /> : "Create new API Key"}
              </Button>
            </EmptyState>
          </Card>
        )}
      </main>
    </div>
  );
};

type StepProps = {
  id: string;
  title: string;
  description: string;
  state: "current" | "upcoming" | "completed";
};

const Step: React.FC<StepProps> = ({ id, title, description, state }) => {
  return (
    <div
      className={cn("group h-full flex items-start px-6 py-5 text-sm font-medium duration-1000", {
        "bg-amber-900/5 hover:bg-amber-900/10  ": state === "current",
      })}
    >
      <Particles
        className={cn("absolute inset-0 opacity-0 duration-1000 hover:opacity-100", {
          "opacity-50": state === "current",
        })}
        quantity={50}
        color="#fbbf24"
        vx={0.2}
      />

      <span
        className={cn(
          "flex justify-center items-center rounded w-6 h-6 text-xs font-medium ring-1 ring-inset",
          {
            "bg-amber-400/10 text-amber-400 ring-amber-400/30 shadow-xl shadow-amber-500/50 group-hover:shadow-amber-400/70 duration-1000":
              state === "current",
            "text-zinc-400 ring-zinc-400/30": state === "upcoming",
            "text-zinc-200 ring-zinc-200/70": state === "completed",
          },
        )}
      >
        {state === "completed" ? <Check className="w-3 h-3" /> : id}
      </span>
      <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
        <span
          className={cn("text-sm font-medium", {
            "text-zinc-200": state === "current",
            "text-zinc-400": state !== "current",
          })}
        >
          {title}
        </span>
        <span
          className={cn("text-sm font-medium", {
            "text-zinc-400": state === "current",
            "text-zinc-500": state !== "current",
          })}
        >
          {description}
        </span>
      </span>
    </div>
  );
};
