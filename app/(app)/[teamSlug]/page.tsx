import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { PageHeader } from "@/components/page-header"

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

  return (
    <div>
      <PageHeader
        title={team.name}
        description="API Keys"
      />

      {/* <div className="flex items-center justify-between h-full py-6 mt-8"></div>

      <div>
        <pre className="p-4 mt-20 font-mono whitespace-pre border border-neutral-300 rounded-md">
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
      </div> */}
    </div>
  )
}
