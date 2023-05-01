import { Policy as GenericPolicy } from "@chronark/access-policies";

export type Resources = {
  channel: [
    /**
     * Create a new channel
     */
    "create",
    /**
     * Read channel config as well as events in the channel
     */
    "read",
    /**
     * Change an existing channel's configuration
     */
    "update",
    /**
     * Allow sending events to the channel
     */
    "ingest",
    /**
     * Can delete a channel
     */
    "delete",
  ];
};

type TenantId = string;
type ResourceId = string;
/**
 * Global Resource ID
 */
export type GRID = `${TenantId}::${keyof Resources | "*"}::${ResourceId}`;

export class Policy extends GenericPolicy<Resources, GRID> {}
