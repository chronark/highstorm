import { auth } from "@clerk/nextjs/app-beta";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (userId) {
    redirect("/home");
  }

  return <>{children}</>;
}
