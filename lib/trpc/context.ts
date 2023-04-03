import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  const session = await getServerSession(req, res, authOptions);

  return {
    req,
    res,
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;