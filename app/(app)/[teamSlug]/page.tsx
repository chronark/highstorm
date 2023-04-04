import { notFound, redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { NavLink } from "./[channelName]/nav-link"
import { Navbar } from "@/components/navbar"

export default async function Teampage(props: {
  params: { teamSlug: string }
}) {
  const { session } = await getSession()

  if (!session) {
    return redirect("/auth/sign-in")
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })

  if (!user) {
    return redirect("/auth/sign-in")
  }

  const team = await db.team.findUnique({
    where: {
      slug: props.params.teamSlug,
    },
    include: {
      apikeys: true,
    },
  })
  if (!team) {
    return notFound()
  }


  return (<div>
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {team.name}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {team.id}
        </p>
      </div>
      <NavLink
        href={`/${props.params.teamSlug}/apikeys`}
        segment="apikeys"
      >
        API Keys
      </NavLink>
      <NavLink
        href={`/${props.params.teamSlug}`}
        segment={null}
      >
        Team
      </NavLink>


    </div>


    <div className="py-6 h-full mt-8 flex items-center justify-between">


    </div>

    <div>

      <pre className="font-mono whitespace-pre mt-20 border border-neutral-300 rounded-md p-4">
        {`curl 'https://highstorm.vercel.app/api/v1/events/users.signup' \\
-H 'Authorization: Bearer ${team.apikeys.at(0)?.keyHash}' \\
-H 'Content-Type: application/json' \\
-d '{
"event": "${user?.name} has signed up",
"content": "A new user has signed up",
"metadata": {"userId": "${user?.id}"}
}'
`}
      </pre>
    </div>
  </div >

  )
}
