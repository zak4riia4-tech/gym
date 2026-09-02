import type { MetadataRoute } from "next";
import { seo, site } from "@/content/site";

/**
 * Makes the site installable.
 *
 * On Android this triggers Chrome's install prompt. On iOS, Safari has no
 * prompt at all — the visitor must use Share -> Add to Home Screen — but the
 * manifest and the apple-* tags in the layout are what make it open full
 * screen with the right icon and colours once they do.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand.name} — ${seo.business.city}`,
    short_name: site.brand.name,
    description: seo.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0908",
    theme_color: "#0A0908",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
