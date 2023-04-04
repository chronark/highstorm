import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { NavLink } from "./[channelName]/nav-link"

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
        actions={[
          <Link href={`/${props.params.teamSlug}/apikeys`}>
            <Button variant="ghost">API Keys</Button>
          </Link>,
          <Link href={`/${props.params.teamSlug}/`}>
            <Button variant="default">Home</Button>
          </Link>,
        ]}
      />

      <div className="py-6 h-full mt-8 flex items-center justify-between"></div>

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
    </div>
  )
}
