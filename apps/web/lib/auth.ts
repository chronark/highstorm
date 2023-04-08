import { auth, clerkClient } from "@clerk/nextjs/app-beta";

export async function getOrg(slug: string): Promise<{ id: string } | null> {
  console.log({ slug });
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const org = await clerkClient.organizations.getOrganization({ slug }).catch(() => {
    return null;
  });
  if (!org) {
    return null;
  }
  const members = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: org.id,
  });
  const isMember = members.some((m) => m.publicUserData?.userId === userId);
  if (!isMember) {
    return null;
  }
  return org;
}
