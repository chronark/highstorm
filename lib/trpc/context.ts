import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next"
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
    const session = await getServerSession(req)

    return {
        req,
        res,
        user: { id: session?.user?.id },
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;