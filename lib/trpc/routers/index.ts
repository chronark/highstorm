import { t } from "../trpc"
import { channelRouter } from "./channel"
import { eventRouter } from "./event"

export const router = t.router({
  channel: channelRouter,
  event: eventRouter,
})

// export type definition of API
export type Router = typeof router
