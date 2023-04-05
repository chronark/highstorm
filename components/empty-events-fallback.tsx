import { db } from "@/prisma/db"
import { Ghost } from "lucide-react"

import { getSession } from "@/lib/auth"

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
    <div className="overflow-hidden border border-neutral-300 rounded-md bg-neutral-50">
      <div className="flex flex-col items-center p-8 gap-4">
        <Ghost />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No Events</h3>
        <p className="mt-1 text-sm text-gray-500">
          To get started, you can publish an event using curl:
        </p>
        <pre className="p-4 font-mono text-left whitespace-pre bg-white border  border-neutral-300 rounded-md">
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
      </div>
    </div>
  )
}
