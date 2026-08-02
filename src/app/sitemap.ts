import type { MetadataRoute } from "next";
import { getDirectoryParticipants } from "@/lib/directory";
import { getRoster } from "@/lib/roster";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pixie-dust-cheesecake.vercel.app";
  const staticRoutes = [
    "",
    "/cohort",
    "/partners",
    "/partners/directory",
    "/partners/login",
    "/partners/signup",
    "/studio",
    "/status",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const profileRoutes = getRoster().map((p) => ({
    url: `${base}/profiles/${p.slug}`,
    lastModified: new Date(),
  }));
  const directoryRoutes = getDirectoryParticipants().map((p) => ({
    url: `${base}/partners/directory/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...profileRoutes, ...directoryRoutes];
}
