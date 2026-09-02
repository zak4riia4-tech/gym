import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Hides the framework version from response headers. Small, free, standard.
  poweredByHeader: false,

  /*
   * Baseline security headers, applied to every response.
   *
   * A Content-Security-Policy is deliberately NOT set here: Next injects
   * inline scripts for hydration, so a CSP needs per-request nonces to avoid
   * breaking the site. That is worth doing, but it belongs in its own step
   * with its own testing rather than being switched on blind.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop the browser guessing a file is a script when it is not.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Refuse to be embedded in someone else's page (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Send the origin, never the full path, to other sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here needs a camera, a microphone or a location.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Keep the staff area out of search results even if a link leaks.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  images: {
    /* Trainer photos are loaded from Unsplash while the gym supplies its own.
       To switch to local photos: drop them in /public/media/trainers/ and
       change the `image` field in src/content/site.ts to "/media/trainers/x.jpg". */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Trainer photos uploaded through the admin dashboard live here.
      {
        protocol: "https",
        hostname: "dttmbtvidrpkfpirzcke.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
