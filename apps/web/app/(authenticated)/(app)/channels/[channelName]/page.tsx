import { getTenantId } from "@/lib/auth";
import { db } from "@/prisma/db";
import { notFound } from "next/navigation";
import { Analytics } from "./analytics";

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

  return <Analytics channel={{ id: channel.id, name: channel.name }} />;
}
