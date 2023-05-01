import { db } from "@/prisma/db";
import { Onboarding } from "./client";
import { getTenantId } from "@/lib/auth";

export default async function OnboardingPage() {
  const tenantId = getTenantId();

  await db.tenant.upsert({
    where: {
      id: tenantId,
    },
    update: {},
    create: {
      id: tenantId,
      plan: "FREE",
    },
  });

  return <Onboarding />;
}
