import * as trpcNext from "@trpc/server/adapters/next";
import { router } from "@/lib/trpc/routers";
import { createContext } from "@/lib/trpc/context";
export default trpcNext.createNextApiHandler({
  router,
  createContext,
});