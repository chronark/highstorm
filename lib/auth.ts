import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { Session, getServerSession } from "next-auth"

export async function getSession(): Promise<
  { session: Session } | { session: null }
> {
  const session = await getServerSession(authOptions)
  return { session }
}
