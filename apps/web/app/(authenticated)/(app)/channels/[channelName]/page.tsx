import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { trpc } from "@/lib/trpc/client";
import { AreaChart, ColumnChart, fillRange } from "@/components/charts";
import { Loading } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ms from "ms";
import { Card } from "@/components/card";
import { Heading } from "@/components/text";
import { getTenantId } from "@/lib/auth";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import { Analytics } from "./analytics";
import { Feed } from "@/components/feed";

export default async function Page(props: {
  params: { channelName: string };
}) {
  const tenantId = getTenantId();
  const channel = await db.channel.findFirst({
    where: {
      name: props.params.channelName,
      tenantId,
    },
  });
  if (!channel) {
    return notFound();
  }

  return (
    <div className="flex h-full gap-8">
      <div className="w-2/3 h-full">
        <Analytics channel={{ id: channel.id, name: channel.name }} />
      </div>

      <div className="w-1/3">
        <Feed />
      </div>
    </div>
  );
}
