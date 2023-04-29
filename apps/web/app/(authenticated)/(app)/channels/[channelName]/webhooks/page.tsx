import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DeleteWebhookButton } from "./deleteWebhookButton";
import { auth } from "@clerk/nextjs/app-beta";
import { EmptyState } from "@/components/empty-state";
import { CreateReportButton } from "../createReportButton";
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { getTenantId } from "@/lib/auth";
import { Header } from "../header";
import { CreateWebhookButton } from "../createWebhookButton";

export default async function Page(props: { params: { tenantSlug: string; channelName: string } }) {
  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          id: getTenantId(),
        },
        name: props.params.channelName,
      },
    },
    include: {
      webhooks: true,
      tenant: true,
    },
  });
  if (!channel) {
    return notFound();
  }

  return (
    <div>
      <Header
        channel={{ name: channel.name }}
        actions={[
          <CreateWebhookButton
            key="create-webhook"
            channelName={channel.name}
            channelId={channel.id}
          />,
        ]}
      />
      {channel.webhooks.length === 0 ? (
        <EmptyState
          title="No webhooks found"
          description="Create your first webhook by clicking the menu button above"
        />
      ) : (
        <ul role="list" className="space-y-4">
          {channel.webhooks.map((webhook) => (
            <li
              key={webhook.id}
              className="flex items-center justify-between p-4 border rounded border-zinc-200 dark:border-zinc-800"
            >
              <div>
                <span className="px-2 py-1 font-mono text-sm ">{webhook.url}</span>
                {/* <p className="mx-1 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {webhook.method}
                </p> */}
              </div>
              <DeleteWebhookButton webhookId={webhook.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
