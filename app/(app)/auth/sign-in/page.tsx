import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth"
import { Form } from "./form"

export default async function SignInPage() {
  const { session } = await getSession()
  if (session) {
    return redirect("/home")
  }
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-tr from-zinc-100 to-white">
      <main className="relative flex items-center justify-center h-full">
        <Form />
      </main>
    </div>
  )
}
