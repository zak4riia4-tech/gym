import { Footer } from "@/components/layout/Footer";
import { MarqueeBand } from "@/components/layout/MarqueeBand";
import { Navbar } from "@/components/layout/Navbar";
import { CallToAction } from "@/components/sections/CallToAction";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Membership } from "@/components/sections/Membership";
import { Programs } from "@/components/sections/Programs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trainers } from "@/components/sections/Trainers";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { seo, site } from "@/content/site";

/*
 * Rendered per request, not at build time.
 *
 * Plans and trainers come from the database, so a statically prerendered
 * homepage would keep serving whatever was true when the site was last built —
 * an edit in the admin would appear to do nothing. For a busier site, swap this
 * for `export const revalidate = 60` to cache the page for a minute at a time.
 */
export const dynamic = "force-dynamic";

/*
 * Structured data. This is how a search engine understands that the page
 * describes a real gym in Erbil rather than a blog post, which is what gets a
 * business into local search and map results.
 *
 * Everything here is drawn from site.ts. Replace those placeholder details with
 * the gym's real address and phone number before going live — publishing an
 * address that is not theirs is worse than publishing none.
 */
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: site.brand.name,
  legalName: seo.business.legalName,
  description: seo.description,
  url: seo.siteUrl,
  telephone: seo.business.phone,
  openingHours: seo.business.openingHours,
  address: {
    "@type": "PostalAddress",
    streetAddress: seo.business.streetAddress,
    addressLocality: seo.business.city,
    addressRegion: seo.business.region,
    addressCountry: seo.business.country,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static object built above, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* Skip link — the first thing a keyboard user reaches, so they can jump
          past the navigation straight to the content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[2px] focus:bg-brass focus:px-4 focus:py-3 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.16em] focus:text-void"
      >
        Skip to content
      </a>

      <Navbar />

      {/* The page's single h1 now lives visibly in the hero, where it belongs. */}
      {/* Section order follows the plan approved in step one. Dark and light
          alternate so the page has rhythm rather than one long dark scroll. */}
      <main id="main">
        <Hero />
        <WhyChooseUs />
        <Programs />
        <MarqueeBand />
        <Membership />
        <Trainers />
        <Gallery />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}
