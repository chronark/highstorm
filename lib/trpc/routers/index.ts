import { t } from "../trpc"
import { apikeyRouter } from "./apikey"
import { channelRouter } from "./channel"
import { eventRouter } from "./event"
import { reportRouter } from "./report"

export const router = t.router({
  channel: channelRouter,
  event: eventRouter,
  apikey: apikeyRouter,
  report: reportRouter,
})

// export type definition of API
export type Router = typeof router
