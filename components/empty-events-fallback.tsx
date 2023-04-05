import { db } from "@/prisma/db"
import { Ghost } from "lucide-react"

import { getSession } from "@/lib/auth"
import { EmptyState } from "./empty-state"

type Props = {
  teamSlug: string
  channelName: string
}
export async function EmptyEventsFallback({ channelName, teamSlug }: Props) {
  const { session } = await getSession()
  if (!session) {
    return <></>
  }
  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return <></>
  }
  const apiKey = await db.apiKey.findFirst({
    where: { team: { slug: teamSlug } },
  })

  const url = process.env.VERCEL_URL
    ? "https://highstorm.vercel.app"
    : "http://localhost:3000"

  return (
    <EmptyState
      title="No Events"
      description="To get started, you can publish an event using curl:"
    >
      <pre className="p-4 font-mono text-left whitespace-pre bg-white border rounded-md border-neutral-300">
        {`curl '${url}/api/v1/events/${channelName ?? "users.signup"}' \\
    -H 'Authorization: Bearer ${apiKey?.keyHash}' \\
    -H 'Content-Type: application/json' \\
    -d '{
            "event": "${user?.name} has signed up",
            "content": "A new user has signed up",
            "metadata": {"userId": "${user?.id}"}
        }'
`}
      </pre>
    </EmptyState>

  )
}
