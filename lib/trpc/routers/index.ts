import { t } from "../trpc"
import { apikeyRouter } from "./apikey"
import { channelRouter } from "./channel"
import { eventRouter } from "./event"

export const router = t.router({
  channel: channelRouter,
  event: eventRouter,
  apikey: apikeyRouter,
})

// export type definition of API
export type Router = typeof router
