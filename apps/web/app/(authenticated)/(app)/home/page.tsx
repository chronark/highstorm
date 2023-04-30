import { notFound, redirect } from "next/navigation";
import { db } from "@/prisma/db";

import { getTenantId } from "@/lib/auth";

export default async function Page() {
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
  if (tenant.channels.length === 0) {
    return redirect("/onboarding");
  }
  return redirect("/overview");
}
