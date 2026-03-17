// lib/prisma.ts
// ⚠️ Prisma v6 — import depuis app/generated/prisma/client + PrismaPg adapter
// Doc: https://www.prisma.io/docs/guides/frameworks/nextjs

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton global pour éviter les connexions multiples en dev (hot reload Next.js)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;