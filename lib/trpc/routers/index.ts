import { t } from "../trpc";
import { channelRouter } from "./channel";
export const router = t.router({
    channel: channelRouter,
});

// export type definition of API
export type Router = typeof router;