import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

/**
 * The list of pages a search engine should index.
 *
 * Only the public homepage exists today. When trainer profile or programme
 * pages are added, push their URLs onto this array and search engines pick
 * them up on the next crawl.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
