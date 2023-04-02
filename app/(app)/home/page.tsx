import { auth } from "@clerk/nextjs/app-beta";
import { db } from "@/prisma/db";
import { notFound, redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/auth/sign-in");
  }

  const team = await db.team.findFirst({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  if (!team) {
    return notFound();
  }
  redirect(`/${team.slug}`);
}
