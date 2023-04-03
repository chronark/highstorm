import { notFound, redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"

export default async function Home() {
  const { session } = await getSession()
  if (!session) {
    return redirect("/auth/sign-in")
  }

  const team = await db.team.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  })

  if (!team) {
    return notFound()
  }
  redirect(`/${team.slug}`)
}
