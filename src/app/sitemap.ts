import type { MetadataRoute } from "next";
import { getRoster } from "@/lib/roster";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pixie-dust-cheesecake.vercel.app";
  const staticRoutes = ["", "/cohort", "/partners", "/studio", "/status"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const profileRoutes = getRoster().map((p) => ({
    url: `${base}/profiles/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...profileRoutes];
}
