import { notFound, redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"

export default async function Teampage(props: {
  params: { teamSlug: string }
}) {
  const { session } = await getSession()

  if (!session) {
    return redirect("/auth/sign-in")
  }

  const user = await db.user.findUnique({where:{id:session.user.id}})

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

  return (
    <div>
      Try the following curl command to send an event, then reload this page to
      see the event in the list.
      <pre className="font-mono whitespace-pre mt-20 border border-neutral-300 rounded-md p-4">
        {`curl 'https://highstorm.vercel.app/api/v1/events/users.signup' \\
  -H 'Authorization: Bearer ${team.apikeys.at(0)?.keyHash}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event": "${user?.name} has signed up",
    "metadata": {"userId": "${user?.id}"}
  }'
`}
      </pre>
    </div>
  )
}
