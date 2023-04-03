import { z } from "zod"

const schema = z.object({
  VERCEL_ENV: z
    .enum(["development", "preview", "production"])
    .optional()
    .default("development"),
  VERCEL_URL: z.string().optional(),
  DATABASE_URL: z.string(),
  TINYBIRD_TOKEN: z.string(),
  GITHUB_OAUTH_ID: z.string(),
  GITHUB_OAUTH_SECRET: z.string(),
  NEXTAUTH_SECRET: z.string(),
})

export const env = schema.parse(process.env)
