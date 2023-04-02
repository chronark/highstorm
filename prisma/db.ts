export * from "@prisma/client";
import { PrismaClient } from "@prisma/client";

let cachedPrisma: PrismaClient | undefined = undefined;

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!cachedPrisma) {
    cachedPrisma = new PrismaClient();
  }
  prisma = cachedPrisma;
}

export const db = prisma;
