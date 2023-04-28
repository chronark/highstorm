import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Plan = "DISABLED" | "FREE" | "PRO" | "ENTERPRISE";
export type ApiKey = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  tenantId: string;
  name: string;
  keyHash: string;
  lastCharacters: string | null;
  policy: string | null;
};
export type Channel = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  tenantId: string;
  valueName: string | null;
};
export type Report = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  lastRunAt: Timestamp | null;
  cron: string;
  scheduleId: string;
  timeframe: number;
  channelId: string;
};
export type SlackSubscription = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  url: string;
  reportId: string | null;
};
export type Tenant = {
  id: string;
  slug: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  plan: Plan;
  stripeCustomerId: string | null;
  deactivatedAt: Timestamp | null;
};
export type DB = {
  ApiKey: ApiKey;
  Channel: Channel;
  Report: Report;
  SlackSubscription: SlackSubscription;
  Tenant: Tenant;
};
