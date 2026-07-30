import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://pixie-dust-cheesecake.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
