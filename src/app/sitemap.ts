import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE = "https://neuroviz.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const architectures = await prisma.architecture.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { order: "asc" },
  });

  const archPages: MetadataRoute.Sitemap = architectures.map((a) => ({
    url: `${BASE}/architectures/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  return [
  { url: BASE,                    lastModified: "2026-03-01", changeFrequency: "monthly", priority: 1.0 },
  { url: `${BASE}/architectures`, lastModified: "2026-03-01", changeFrequency: "monthly", priority: 0.9 },
  ...archPages,
];
}