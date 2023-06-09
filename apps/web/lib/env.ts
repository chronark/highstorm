import { z } from "zod";

const schema = z.object({
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional().default("development"),
  VERCEL_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  TINYBIRD_TOKEN: z.string(),
  QSTASH_TOKEN: z.string(),
  QSTASH_CURRENT_SIGNING_KEY: z.string(),
  QSTASH_NEXT_SIGNING_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
});

export const env = schema.parse(process.env);
