import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

/**
 * Tells crawlers what they may index.
 *
 * The admin area is excluded. That is housekeeping, not security — anyone can
 * read robots.txt, so it keeps staff pages out of search results while Row
 * Level Security is what actually protects the data.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
