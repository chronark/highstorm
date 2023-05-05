import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Plan = "DISABLED" | "FREE" | "PRO" | "ENTERPRISE";
export const Plan = {
  DISABLED: "DISABLED",
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
};
export type WebhookType = "SLACK" | "HTTP";
export const WebhookType = {
  SLACK: "SLACK",
  HTTP: "HTTP",
};
export type ApiKey = {
  id: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  tenantId: string;
  name: string;
  keyHash: string;
  lastCharacters: string | null;
  firstCharacters: string | null;
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
export type Webhook = {
  id: string;
  name: string;
  type: WebhookType;
  url: string;
  method: string;
  channelId: string;
  header: unknown | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type DB = {
  ApiKey: ApiKey;
  Channel: Channel;
  Report: Report;
  SlackSubscription: SlackSubscription;
  Tenant: Tenant;
  Webhook: Webhook;
};
