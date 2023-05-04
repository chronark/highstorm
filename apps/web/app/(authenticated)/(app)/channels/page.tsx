import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { getTenantId } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CreateChannelButton } from "./CreateChannelButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Row } from "./row";
import { EmptyState } from "@/components/empty-state";

export default async function Page(_props: { params: { tenantSlug: string } }) {
  const tenantId = getTenantId();
  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      channels: true,
    },
  });
  if (!tenant) {
    return notFound();
  }

  return (
    <div className="">
      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
        <PageHeader title="Channels" actions={[<CreateChannelButton key="create-channel" />]} />
      </div>

      {tenant.channels.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Pretty empty around here"
          description="Let's create your first channel."
        />
      ) : (
        <ul role="list" className="mt-8 divide-y divide-white/10">
          {tenant.channels
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((channel) => (
              <Row key={channel.id} channel={channel} />
            ))}
        </ul>
      )}
    </div>
  );
}
